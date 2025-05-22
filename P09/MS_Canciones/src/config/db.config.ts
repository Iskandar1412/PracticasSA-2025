import dotenv from 'dotenv';
dotenv.config();

interface DBConfig {
    DB_HOST_MS_CANCIONES: string;
    DB_PORT_MS_CANCIONES: string;
    DB_USER_MS_CANCIONES: string;
    DB_PASSWORD_MS_CANCIONES: string;
    DB_MS_CANCIONES: string;
}

const {
    DB_HOST_MS_CANCIONES,
    DB_PORT_MS_CANCIONES,
    DB_USER_MS_CANCIONES,
    DB_PASSWORD_MS_CANCIONES,
    DB_MS_CANCIONES 
}: DBConfig = process.env as unknown as DBConfig;

if(!DB_HOST_MS_CANCIONES || !DB_PORT_MS_CANCIONES || !DB_USER_MS_CANCIONES || !DB_PASSWORD_MS_CANCIONES || !DB_MS_CANCIONES) {
    throw new Error(`Error en la obtención de variables de base de datos`);
}

export {
    DB_HOST_MS_CANCIONES,
    DB_PORT_MS_CANCIONES,
    DB_USER_MS_CANCIONES,
    DB_PASSWORD_MS_CANCIONES,
    DB_MS_CANCIONES
}