const UserModel = require("../../models/usuario.model");

const registrarAdministrador = async(req, res, next) => {
    const { names, last, years, user, email, pass } = req.body;
    
    try {
        if(!names || !last || !years || years <= 0 || !user || !email || !pass) {
            const error = new Error('Campos requeridos');
            error.statusCode = 400;
            throw error;
        }

        const correoExistente = await UserModel.BuscarUsuario(email);
        if (correoExistente) {
            const error = new Error('Correo existente');
            error.statusCode = 409;
            throw error;
        }

        const usuarioExistente = await UserModel.BuscarUsuario(user);
        if(usuarioExistente) {
            const error = new Error('Usuario existente');
            error.statusCode = 409;
            throw error;
        }

        const usuarioID = await UserModel.CrearCuentaAdministrador(names, last, years, user, email, pass);

        res.status(201).json({ success: true, message: 'Administrador registrado exitosamente', usuarioID });
    } catch(e) {
        next(e);
    }
}

const registrarUsuario = async(req, res, next) => {
    const { names, last, years, user, email, pass } = req.body;
    
    try {
        if(!names || !last || !years || years <= 0 || !user || !email || !pass) {
            const error = new Error('Campos requeridos');
            error.statusCode = 400;
            throw error;
        }
        
        const correoExistente = await UserModel.BuscarUsuario(email);
        if (correoExistente) {
            const error = new Error('Correo existente');
            error.statusCode = 409;
            throw error;
        }
        const usuarioExistente = await UserModel.BuscarUsuario(user);
        if(usuarioExistente) {
            const error = new Error('Usuario existente');
            error.statusCode = 409;
            throw error;
        }

        const usuarioID = await UserModel.CrearCuentaUsuario(names, last, years, user, email, pass);
        
        res.status(201).json({ success: true, message: 'Usuario registrado exitosamente', usuarioID });
    } catch(e) {
        next(e);
    }
}

module.exports = {
    registrarAdministrador,
    registrarUsuario
};