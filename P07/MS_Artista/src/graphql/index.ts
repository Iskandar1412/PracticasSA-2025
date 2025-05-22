import { readFileSync } from "fs";
import path from "path";
import { artistaResolver } from "./resolvers/artista.resolver";

const artistaTypes = readFileSync(path.join(__dirname, './typeDefs/artista.graphql'), {
    encoding: 'utf-8',
})

export const typeDefs = `${artistaTypes}`;

export const resolvers = {
    Query: {
        ...artistaResolver.Query,
    },
    Mutation: {
        ...artistaResolver.Mutation,
    },
};