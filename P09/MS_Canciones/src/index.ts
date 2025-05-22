import express from 'express';
import cors from 'cors';
const morgan = require('morgan')
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { PORT_APP_MS_CANCIONES } from './config/app.config';
import { resolvers, typeDefs } from './graphql';
import DateTimeScalar from './graphql/scalar/dateTime.scalar';
// import DateTimeScalar from './graphql/scalar/dateTime.scalar';

const app = express();

const bootstrapServer = async () => {
    const server = new ApolloServer({
        typeDefs,
        resolvers: {
            ...resolvers,
            DateTime: DateTimeScalar,
        }
    });

    await server.start();

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(morgan('dev'))
    app.use('/cancion/graphql', expressMiddleware(server));

    app.get('/cancion', (req, res) => {
        res.send(`APP corriendo`);
    });

    app.listen(PORT_APP_MS_CANCIONES, () => {
        console.log(`Microservicio Cancion en ${PORT_APP_MS_CANCIONES}/cancion`);
        console.log(`Microservicio Cancion GraphQL en ${PORT_APP_MS_CANCIONES}/cancion/graphql`);
    })
}

bootstrapServer();