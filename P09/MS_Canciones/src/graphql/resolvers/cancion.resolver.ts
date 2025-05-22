import { GraphQLResolveInfo } from "graphql";
import { createCancion, getCancion, getCanciones } from "../services/cancion.service";

export const cancionResolver = {
    Query: {
        async canciones(_: any, args: Record<string, any>, context: any, info: GraphQLResolveInfo) {
            return await getCanciones({ info })
        },
        async cancion(_: any, args: Record<string, any>, context: any, info: GraphQLResolveInfo) {
            return await getCancion({ id: args.id, info })
        },
    },
    Mutation: {
        async createCancion(_: any, { input }: Record<string, any>) {
            return await createCancion({ titulo: input.titulo, duracion: input.duracion, artista_id: input.artista_id, album_id: input.album_id, fecha_lanzamiento: input.fecha_lanzamiento });
        }
    },
};