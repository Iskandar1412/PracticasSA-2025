import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { PORT_APP_MS_ARTISTA } from './config/app.config';
// import corsOptions from './config/cors.config';
import { resolvers, typeDefs } from './graphql';
// import DateTimeScalar from './graphql/scalar/dateTime.scalar';

const app = express();

const bootstrapServer = async () => {
    const server = new ApolloServer({
        typeDefs,
        resolvers: {
            ...resolvers,
        },
    });
    
    await server.start();

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use("/artista/graphql", expressMiddleware(server));

    app.get('/artista', (req, res) => {
        res.send(`APP corriendo`);
    });

    app.listen(PORT_APP_MS_ARTISTA, () => {
        console.log(`Micoservicio Artista en ${PORT_APP_MS_ARTISTA}/artista`);
        console.log(`Micoservicio Artista GraphQL en ${PORT_APP_MS_ARTISTA}/artista/graphql`);
    })
}

bootstrapServer();