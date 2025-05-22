const fs = require('fs');
const { Sequelize, DataTypes } = require('sequelize'); // npm i sequelize
const path = require('path');
const { DB_HOST, DB_USER, DB_PASSWORD, DB_DB } = require('../config/db.config');
const { pool } = require('../config/db');

const sequelize = new Sequelize(DB_DB, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql',
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    }
});

sequelize.authenticate()
    .then(() => {
        console.log('Conexión establecida exitosamente');
    })
    .catch((e) => {
        console.log('Error en la conexión con la base de datos:', e);
    });

const Usuario = require('./templates/user.model')(sequelize, DataTypes);
const Roles = require('./templates/roles.model')(sequelize, DataTypes);

sequelize.sync({alter: true})
.then(() => {
    console.log('Base de datos actualizada');
})
.catch((er) => {
    console.log('Error en actualizar tablas de la base de datos:', er);
});

async function deleteProcedures(path) {
    try {
        const sql = fs.readFileSync(path, {encoding: 'utf-8'});
        const queries = sql.split(';').filter(query => query.trim());
        await Promise.all(queries.map(query => sequelize.query(query)));
    } catch(e) {
        console.log("Error limpieza", e)
    }
}

async function addProcedures(params) {
    try {
        const files = fs.readdirSync(params);
        for (const file of files) {
            const ruta = path.join(params, file);
            if(fs.lstatSync(ruta).isDirectory()) {
                await addProcedures(ruta);
            } else if (path.extname(ruta) === '.sql') {
                const sql = fs.readFileSync(ruta, {encoding: 'utf-8'});
                await sequelize.query(sql);
                const archivo_split = ruta.split('/');
                const nombre_archivo = archivo_split[archivo_split.length -1];
                const formateo = nombre_archivo.padEnd(30, ' ');
                console.log(`${formateo}\t\t\t ejecutado`);
            }
        }
    } catch(e) {
        console.log('Error creación procedimientos', e)
    }
}

async function addRoles() {
    try {
        const roles = [
            { "rol": "admin" },
            { "rol": "user" }
        ];

        for (const rol of roles) {
            const [peticion] = await pool.promise().query('SELECT COUNT(*) as count FROM roles WHERE rol = ?', [rol.rol]);
            if(peticion[0].count === 0) {
                await pool.promise().query('CALL registrar_rol(?)', [rol.rol]);
                console.log(`Rol ${rol.rol} creado.`);
            } else {
                console.log(`Rol ${rol.rol} existente`);
            }
        } 
    } catch(e) {
        console.log('Error en la inserción de roles');
    }
}

(async function() {
    try {
        const del = path.join(__dirname, './db_del/clear.sql');
        console.log("Eliminando procedimientos");
        await deleteProcedures(del);
        console.log("Fin Eliminación...");
        
        const procedimientos = path.join(__dirname, './procedures/');
        console.log("Creando procedimientos");
        await addProcedures(procedimientos);
        console.log("Fin Creación...");
        
        console.log("Creando roles");
        await addRoles();
        console.log("Fin Creación...");
    } catch(e) {
        console.log('Error en la ejecución de funciones', e);
    }
})();

module.exports ={
    sequelize,
    Usuario,
    Roles
}