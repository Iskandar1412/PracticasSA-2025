const pool = require('../config/db');
const { encrypt, decrypt } = require('../utils/encryption');
const bcrypt = require('bcrypt'); // npm i bcrypt

const UserModel = {
    BuscarUsuario: async(credenciales) => {
        const [response] = await pool.query('CALL buscar_usuario(?)', [encrypt(credenciales)]);
        resultado = response[0][0];
        if(resultado && resultado.id !== null) {
            resultado.nombres = decrypt(resultado.nombres);
            resultado.apellidos = decrypt(resultado.apellidos);
            resultado.usuario = decrypt(resultado.usuario);
            resultado.email = decrypt(resultado.email);
            return resultado;
        }
        return null;
    },

    CrearCuentaUsuario: async (nombres, apellidos, edad, usuario, correo, contrasenia) => {
        const nombreEncriptado = encrypt(nombres);   
        const apellidoEncriptado = encrypt(apellidos);   
        const usuarioEncriptado = encrypt(usuario);   
        const correoEncriptado = encrypt(correo);

        const rondas = 10;
        const hashPassword = await bcrypt.hash(contrasenia, rondas);
        // console.log(nombreEncriptado);
        const [response] = await pool.query('CALL registrar_usuario(?,?,?,?,?,?)',
            [nombreEncriptado, apellidoEncriptado, edad, usuarioEncriptado, correoEncriptado, hashPassword]
        );
        return response;
    },

    CrearCuentaAdministrador: async (nombres, apellidos, edad, usuario, correo, contrasenia) => {
        const nombreEncriptado = encrypt(nombres);   
        const apellidoEncriptado = encrypt(apellidos);   
        const usuarioEncriptado = encrypt(usuario);   
        const correoEncriptado = encrypt(correo);

        const rondas = 10;
        const hashPassword = await bcrypt.hash(contrasenia, rondas);

        const [response] = await pool.query('CALL registrar_administrador(?,?,?,?,?,?)',
            [nombreEncriptado, apellidoEncriptado, edad, usuarioEncriptado, correoEncriptado, hashPassword]
        );
        return response;
    },
}

module.exports = UserModel;