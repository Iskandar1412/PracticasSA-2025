const allowedOrigins = ['http://localhost:5173', 'http://192.168.0.9:5173', 'http://192.168.0.19:5173'];

const corsOptions = {
    origin: function(origin, callback) {
        if(!origin) return callback(null, true); // permitir solicitudes sin origen
        if(allowedOrigins.indexOf(origin) !== -1) { // para permitir los que estan en la lista
            return callback(null, true);
        } else {
            // permitir cualquier origen (no recomendado)
            // return callback(null, true);
            // restriccion de origenes confiables (mejor opcion)
            return callback(new Error('Origin not allowed by CORS'));
        }
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,POST,PATCH,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
};

module.exports = corsOptions;