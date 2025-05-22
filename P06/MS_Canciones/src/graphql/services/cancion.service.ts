import { PrismaClient } from "@prisma/client";
import { extractSelection } from "../utils/extractSelections";
import { GraphQLResolveInfo } from "graphql";

interface GetCancionesArgs {
    info: GraphQLResolveInfo;
}

interface GetCancionArgs extends GetCancionesArgs {
    id: number;
}

interface CancionInput {
    titulo: string;
    duracion: number;
    artista_id: number;
    album_id: number;
    fecha_lanzamiento: Date
}

const prisma = new PrismaClient();

export const getCanciones = async ({ info }: GetCancionesArgs) => {
    const extractedSelections = extractSelection(info);
    return await prisma.cancion.findMany();
}

export const getCancion = async ({ id, info }: GetCancionArgs) => {
    const extractedSelections = extractSelection(info);
    return await prisma.cancion.findUnique({ where: { id } })
}

export const createCancion = async ({ titulo, duracion, artista_id, album_id, fecha_lanzamiento }: CancionInput) => {
    try {
        const createdCancion = await prisma.cancion.create({
            data: {
                titulo,
                duracion,
                artista_id, 
                album_id,
                fecha_lanzamiento
            }
        });

        return createdCancion;
    } catch(error) {
        console.log("Error creando cancion:", error);
        throw new Error('Failed to create cancion');
    }
}