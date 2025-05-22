const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRATION, JWT_REFRESH_EXPIRATION } = require('../config/auth');

const generarToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email, rol: user.rol }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};

const refrescarToken = (user) => {
    return jwt.sign({ id:  user.id, email: user.email, rol: user.rol }, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRATION });
};

module.exports = { generarToken, refrescarToken };