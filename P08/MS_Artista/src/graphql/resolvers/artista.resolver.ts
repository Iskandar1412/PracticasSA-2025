import { GraphQLResolveInfo } from "graphql";
import { createArtista, getArtista, getArtistas } from "../services/artista.service";

export const artistaResolver = {
    Query: {
        async artistas(_: any, args: Record<string, any>, context: any, info: GraphQLResolveInfo) {
            return await getArtistas({ info })
        },
        async artista(_: any, args: Record<string, any>, context: any, info: GraphQLResolveInfo) {
            return await getArtista({ id: args.id, info })
        },
    },
    Mutation: {
        async createArtista(_: any, { input }: Record<string, any>) {
            return await createArtista({ nombre: input.nombre, genero_musical: input.genero_musical, pais_origen: input.pais_origen });
        }
    },
};