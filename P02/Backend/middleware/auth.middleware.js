const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRATION } = require('../config/auth');
const { refrescarToken } = require('../utils/token');

// Verificación del jwt para el acceso a rutas protegidas
const autenticar = (req, res, next) => {
    const token = req.cookies.token;

    if(!token) {
        const error = new Error('Acceso denegado: No se ha proporcionado token');
        error.statusCode = 401;
        return next(error);
    };

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if(err) {
            const error = new Error('Acceso denegado: Token invalido o expirado');
            error.statusCode = 403;
            return next(error);
        };
        
        const now = Math.floor(Date.now() / 1000);
        const exp = user.exp;

        if(exp - now < 300) {
            const nuevoToken = refrescarToken(user);
            res.cookie('token', nuevoToken, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60,
            });
        }
        
        req.user = user;
        next();
    });
};

const isAdmin = (req, res, next) => {
    if(req.user.rol !== 'admin') {
        const error = new Error('Acceso denegado: No hay permisos de administrador');
        error.statusCode = 403;
        return next(error);
    }

    next();
}

module.exports = { autenticar, isAdmin };