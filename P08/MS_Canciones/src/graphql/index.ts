import { readFileSync } from "fs";
import path from "path";
import { cancionResolver } from "./resolvers/cancion.resolver";


const cancionTypes = readFileSync(path.join(__dirname, './typeDefs/cancion.graphql'), {
    encoding: 'utf-8',
})

export const typeDefs = `${cancionTypes}`;

export const resolvers = {
    Query: {
        ...cancionResolver.Query,
    },
    Mutation: {
        ...cancionResolver.Mutation,
    },
};