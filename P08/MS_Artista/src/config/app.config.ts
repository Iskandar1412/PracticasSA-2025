import dotenv from 'dotenv';
dotenv.config();

interface AppConfig {
    PORT_APP_MS_ARTISTA: string;
}

const {
    PORT_APP_MS_ARTISTA
}: AppConfig = process.env as unknown as AppConfig;

if(!PORT_APP_MS_ARTISTA) {
    throw new Error(`Error en la obtención de variables de APP`)
}

export {
    PORT_APP_MS_ARTISTA
}