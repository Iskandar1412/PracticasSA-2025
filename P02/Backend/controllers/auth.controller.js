require('../models/index.model');
const { registrarUsuario, registrarAdministrador } = require('./auth/auth.registro');
const { login, logout } = require('./auth/auth.sesion');
const refreshToken = require('./auth/auth.token');

module.exports = {
    registrarUsuario,
    registrarAdministrador,
    login,
    logout,
    refreshToken
};