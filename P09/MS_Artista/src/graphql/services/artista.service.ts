import { PrismaClient } from "@prisma/client";
import { extractSelection } from "../utils/extractSelections";
import { GraphQLResolveInfo } from "graphql";

interface GetArtistasArgs {
    info: GraphQLResolveInfo;
}

interface GetArtistaArgs extends GetArtistasArgs {
    id: number;
}

interface ArtistaInput {
    nombre: string;
    genero_musical?: string;
    pais_origen?: string;
}

const prisma = new PrismaClient();

export const getArtistas = async ({ info }: GetArtistasArgs) => {
    const extractedSelections = extractSelection(info);
    
    return await prisma.artista.findMany();
}

export const getArtista = async ({ id, info }: GetArtistaArgs) => {
    const extractedSelections = extractSelection(info);
    
    return await prisma.artista.findUnique({ where: {id} });
}

export const createArtista = async ({nombre, genero_musical, pais_origen}: ArtistaInput) => {
    try {
        // console.log(nombre, genero_musical, pais_origen)
        const createdArtista = await prisma.artista.create({
            data: {
                nombre,
                genero_musical,
                pais_origen
            },
        });
        // console.log(createdArtista)
        return createdArtista;
    } catch (error) {
        console.error("Error creando artista:", error);
        throw new Error("Failed to create artista");
    }
};
