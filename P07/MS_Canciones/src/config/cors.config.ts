const allowedOrigins: string[] = ['http://localhost:5173', 'http://192.168.0.9:5173', 'http://192.168.0.19:5173'];

const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow: boolean) => void) => {
        if (!origin) {
            return callback(null, true);
        }
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        } else {
            return callback(new Error('Origin not allowed by CORS'), false);
        }
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,POST,PATCH,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
};

export default corsOptions;
