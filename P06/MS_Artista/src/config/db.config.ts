import dotenv from 'dotenv';
dotenv.config();

interface DBConfig {
    DB_HOST_MS_ARTISTA: string;
    DB_PORT_MS_ARTISTA: string;
    DB_USER_MS_ARTISTA: string;
    DB_PASSWORD_MS_ARTISTA: string;
    DB_MS_ARTISTA: string;
}

const {
    DB_HOST_MS_ARTISTA,
    DB_PORT_MS_ARTISTA,
    DB_USER_MS_ARTISTA,
    DB_PASSWORD_MS_ARTISTA,
    DB_MS_ARTISTA 
}: DBConfig = process.env as unknown as DBConfig;

if(!DB_HOST_MS_ARTISTA || !DB_PORT_MS_ARTISTA || !DB_USER_MS_ARTISTA || !DB_PASSWORD_MS_ARTISTA || !DB_MS_ARTISTA) {
    throw new Error(`Error en la obtención de variables de base de datos`);
}

export {
    DB_HOST_MS_ARTISTA,
    DB_PORT_MS_ARTISTA,
    DB_USER_MS_ARTISTA,
    DB_PASSWORD_MS_ARTISTA,
    DB_MS_ARTISTA
}