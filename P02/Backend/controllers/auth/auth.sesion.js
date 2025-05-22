const UserModel = require('../../models/usuario.model');
const { generarToken } = require('../../utils/token');
const bcrypt = require('bcrypt');

const login = async(req, res, next) => {
    const { credentials, pass } = req.body;
    
    try {
        if(!credentials || !pass) {
            const error = new Error('Credenciales y Contraseñas requeridos');
            error.statusCode = 400;
            throw error;
        }

        const usuario = await UserModel.BuscarUsuario(credentials);
        if(!usuario) {
            const error = new Error('Usuario/Correo no existente');
            error.statusCode = 404;
            throw error;
        }

        const passValida = await bcrypt.compare(pass, usuario.pass);
        if(!passValida) {
            const error = new Error('Credenciales invalidas');
            error.statusCode = 401;
            throw error;
        }
        // console.log(usuario);
        const token = generarToken({ id: usuario.id, email: usuario.email, rol: usuario.rol });

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60,
            sameSite: 'lax'
        });

        res.status(200).json({ success: true, message: 'Loggin successful', token, rol: usuario.rol });
    } catch(e) {
        next(e);
    }
};

const logout = async(req, res, next) => {
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'lax'
    });

    res.status(200).json({ success: true, message: 'Loggout exitoso'});
}

module.exports = {
    login,
    logout
};