// const { GestionChatbot } = require('../models/queries/consultas.query');
const { chatDeep } = require('../utils/deepseek.service');
const { ALBUMES_MICROSERVICIO_URL, ARTISTAS_MICROSERVICIO_URL, CANCIONES_MICROSERVICIO_URL, REPRODUCCIONES_MICROSERVICIO_URL } = require('../config/env/servicios.config')
// const { interpretarPreguntaWit } = require('../utils/wit.service');

// function extraerDatosWit(entities) {
//     const parametros = {};
//     for (const key in entities) {
//         const cleanKey = key.includes(":") ? key.split(":").pop() : key;
//         parametros[cleanKey] = entities[key].map(ent =>
//             typeof ent.value !== 'undefined' ? ent.value : ent.body
//         );
//         if (parametros[cleanKey].length === 1) {
//             parametros[cleanKey] = parametros[cleanKey][0];
//         }
//     }
//     return parametros;
// }
function mostrarPlaylists(message, data) {
    // Mensaje de la respuesta
    
    // Crear el contenido HTML
    let htmlContent = `<p><strong>Mensaje:</strong> ${message}</p><br></br><table border="1">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>ID de Usuario</th>
                            </tr>
                        </thead>
                        <tbody>`;

    // Iterar sobre los datos y generar filas para la tabla
    data.forEach(item => {
        htmlContent += `<tr>
                            <td>${item.id}</td>
                            <td>${item.nombre}</td>
                            <td>${item.usuario_id}</td>
                        </tr>`;
    });

    htmlContent += `</tbody></table>`;

    // Insertar el contenido en el div
    // console.log(htmlContent);
    return htmlContent;
}

function mostrarAlbums(message, data) {
    // Mensaje de la respuesta     id, titulo, artista_id, fecha_lanzamiento, genero_musical
    
    // Crear el contenido HTML
    let htmlContent = `<p><strong>Mensaje:</strong> ${message}</p><br></br><table border="1">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Titulo</th>
                                <th>ID Artista</th>
                                <th>Fecha Lanzamiento</th>
                                <th>Genero Musical</th>
                            </tr>
                        </thead>
                        <tbody>`;

    // Iterar sobre los datos y generar filas para la tabla
    data.forEach(item => {
        htmlContent += `<tr>
                            <td>${item.id}</td>
                            <td>${item.titulo}</td>
                            <td>${item.artista_id}</td>
                            <td>${item.fecha_lanzamiento.split('T')[0]}</td>
                            <td>${item.genero_musical}</td>
                        </tr>`;
    });

    htmlContent += `</tbody></table>`;

    // Insertar el contenido en el div
    // console.log(htmlContent);
    return htmlContent;
}

function mostrarArtistas(message, data) {
    // Mensaje de la respuesta

    // Crear el contenido HTML
    let htmlContent = `<p><strong>Mensaje:</strong> ${message}</p><br></br><table border="1">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Pais Origen</th>
                                <th>Genero</th>
                            </tr>
                        </thead>
                        <tbody>`;

    // Iterar sobre los datos y generar filas para la tabla
    data.forEach(item => {
        htmlContent += `<tr>
                            <td>${item.id}</td>
                            <td>${item.nombre}</td>
                            <td>${item.pais_origen}</td>
                            <td>${item.genero_musical}</td>
                        </tr>`;
    });

    htmlContent += `</tbody></table>`;

    // Insertar el contenido en el div
    // console.log(htmlContent);
    return htmlContent;
}

function mostrarCanciones(message, data) {
    // Mensaje de la respuesta
    
    // Crear el contenido HTML
    let htmlContent = `<p><strong>Mensaje:</strong> ${message}</p><br></br><table border="1">
                        <thead>
                            <tr>
                                <th>ID Album</th>
                                <th>ID Artista</th>
                                <th>Duración (s)</th>
                                <th>Fecha Lanzamiento</th>
                                <th>Título</th>
                            </tr>
                        </thead>
                        <tbody>`;

    // Iterar sobre los datos y generar filas para la tabla
    data.forEach(item => {
        htmlContent += `<tr>
                            <td>${item.album_id}</td>
                            <td>${item.artista_id}</td>
                            <td>${item.duracion}</td>
                            <td>${item.fecha_lanzamiento.split('T')[0]}</td>
                            <td>${item.titulo}</td>
                        </tr>`;
    });

    htmlContent += `</tbody></table>`;

    // Insertar el contenido en el div
    // console.log(htmlContent);
    return htmlContent;
}

function extraerJSON(texto) {
    try {
        // Elimina bloques ```json ... ```
        console.log(texto)
        const limpio = texto.replace(/```json|```/g, "").trim();
        return JSON.parse(limpio);
    } catch (err) {
        console.error("Error al parsear JSON:", err);
        return { intent: "unknown" };
    }
}

function validarPayload(intent, data) {
    const definiciones = {
        add_album: {
            titulo: "string",
            artista_id: "number",
            fecha_lanzamiento: "string",
            genero_musical: "string"
        },
        add_artist: {
            nombre: "string",
            pais_origen: "string",
            genero_musical: "string"
        },
        add_song: {
            artista_id: "number",
            album_id: "number",
            duracion: "number",
            titulo: "string",
            fecha_lanzamiento: "string"
        },
        add_playlist: {
            nombre: "string",
            usuario_id: "number",
            fecha_creacion: "string"
        }
    };

    const schema = definiciones[intent];
    if (!schema) return { valido: true }; // intents como get_* no requieren validación

    const faltantes = [];
    const erroresTipo = [];

    for (const campo in schema) {
        const tipoEsperado = schema[campo];

        if (!(campo in data)) {
            faltantes.push(campo);
        } else {
            const valor = data[campo];
            const tipoReal = typeof valor;
            if (tipoEsperado === "number" && isNaN(Number(valor))) {
                erroresTipo.push(`${campo} debe ser numérico`);
            } else if (tipoEsperado === "string" && tipoReal !== "string") {
                erroresTipo.push(`${campo} debe ser texto`);
            }
        }
    }

    if (faltantes.length > 0 || erroresTipo.length > 0) {
        const errores = [
            ...(faltantes.length ? [`Faltan: ${faltantes.join(", ")}`] : []),
            ...(erroresTipo.length ? erroresTipo : [])
        ];
        return {
            valido: false,
            error: errores.join(" | ")
        };
    }

    return { valido: true };
}

const chatDeepseek = async (req, res, next) => {
    try {
        const { message } = req.body
        if(!message) {
            return res.status(400).json({ success: false, message: 'Error' })
        }

        const interpretacion = await chatDeep(message)
        if(!interpretacion.success) { 
            const error = new Error(interpretacion.message)
            error.statusCode = 405
            throw error
        }

        // console.log(interpretacion)
        const { intent, data, reply } = extraerJSON(interpretacion.message)
        const validacion = validarPayload(intent, data)
        if(!validacion.valido) {
            const error = new Error(validacion.error)
            error.statusCode = 400
            throw error
        }
        switch(intent) {
            case "add_album":
                const add_album_post = await fetch(`${ALBUMES_MICROSERVICIO_URL}/albums`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                })

                const res_album_post = await add_album_post.json()
                if(!add_album_post.ok) return res.status(400).json({ success: false, message: res_album_post.message })
                return res.status(201).json({ success: true, message: reply })

            case "add_artist":
                const add_artist_post = await fetch(`${ARTISTAS_MICROSERVICIO_URL}/artista/graphql`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        query: `
                            mutation CreateArtista($input: ArtistaInput!) {
                                createArtista(input: $input) {
                                    nombre
                                    pais_origen
                                    genero_musical
                                }
                            }
                        `,
                        variables: { input: data }
                    })
                })

                const res_artist_post = await add_artist_post.json()
                if(!add_artist_post.ok) return res.status(400).json({ success: false, message: res_artist_post.message })
                return res.status(201).json({ success: true, message: reply })

            case "add_song":
                const add_song_post = await fetch(`${CANCIONES_MICROSERVICIO_URL}/cancion/graphql`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        query: `
                            mutation Mutation($input: CancionInput!) {
                                createCancion(input: $input) {
                                    artista_id
                                    duracion
                                    id
                                    fecha_lanzamiento
                                    titulo
                                }
                            }
                        `,
                        variables: { input: data }
                    })
                })

                const res_song_post = await add_song_post.json()
                if(!add_song_post.ok) return res.status(400).json({ success: false, message: res_song_post.message })
                return res.status(201).json({ success: true, message: reply })

            case "add_playlist":
                const add_playlist_post = await fetch(`${REPRODUCCIONES_MICROSERVICIO_URL}/playlists`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                })

                const res_playlist_post = await add_playlist_post.json()
                if(!add_playlist_post.ok) return res.status(400).json({ success: false, message: res_playlist_post.message })
                return res.status(201).json({ success: true, message: reply })

            case "get_album":
            case "get_albums":
                const response_album_get = await fetch(`${ALBUMES_MICROSERVICIO_URL}/albums`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                })

                const respuesta_album_get = await response_album_get.json()
                if(!response_album_get.ok) { return res.status(400).json({ success: false, message: respuesta_album_get.message }) }
                // console.log("aaaaa")
                return res.status(201).json({ success: true, message: reply, data: mostrarAlbums(reply, respuesta_album_get) })

            case "get_artista":
            case "get_artistas":
                const response_artista_get = await fetch(`${ARTISTAS_MICROSERVICIO_URL}/artista/graphql`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        query: `
                            query Artistas {
                                artistas {
                                    id
                                    nombre
                                    pais_origen
                                    genero_musical
                                }
                            }
                        `
                    })
                })
                const respuesta_artista_get = await response_artista_get.json()
                if(!response_artista_get.ok) { return res.status(400).json({ success: false, message: respuesta_artista_get.message.artistas }) }
                // console.log(respuesta)
                return res.status(201).json({ success: true, message: reply, data: mostrarArtistas(reply, respuesta_artista_get.data.artistas) })

            case "get_songs":
                const response_songs_get = await fetch(`${CANCIONES_MICROSERVICIO_URL}/cancion/graphql`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        query: `
                            query Canciones {
                                canciones {
                                    album_id
                                    artista_id
                                    duracion
                                    fecha_lanzamiento
                                    id
                                    titulo
                                }
                            }
                        `,
                        variables: { input: data }
                    })
                })
                const respuesta_songs_get = await response_songs_get.json()
                if(!response_songs_get.ok) return res.status(400).json({ success: false, message: respuesta_songs_get.message })
                return res.status(201).json({ success: true, message: reply, data: mostrarCanciones(reply, respuesta_songs_get.data.canciones) })

            case "get_playlists":
                const response_playlist_get = await fetch(`${REPRODUCCIONES_MICROSERVICIO_URL}/playlists`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                })
                const respuesta_playlist_get = await response_playlist_get.json()
                if(!response_playlist_get.ok) return res.status(400).json({ success: false, message: respuesta_playlist_get.message })
                return res.status(201).json({ success: true, message: reply, data: mostrarPlaylists(reply, respuesta_playlist_get) })

            case "unknown": // otra pregunta
                return res.status(201).json({ success: true, message: reply })
        }
        res.status(201).json({ message: { intento: intent, data: data, salida: reply }, success: true })
    } catch (e) { next(e) }
}

// const chatFunction = async (req, res, next) => {
//     const usuarioID = 4;
//     try {
//         const { message, usuarioID } = req.body;
//         if (!message || !usuarioID) {
//             return res.status(400).json({ error: 'El mensaje es requerido' });
//         }

//         const interpretacion = await interpretarPreguntaWit(message);
//         // console.log(interpretacion.intencion);
//         const parametros = extraerDatosWit(interpretacion.parametros);
//         // console.log(parametros)
//         let respuesta = {};
//         switch (interpretacion.intencion) {
//             case 'producto':
//                 if(parametros.number || parametros.elemento) {
//                 const data = await new GestionChatbot().obtenerProductos(parametros.number ? parametros.number : parametros.elemento, usuarioID, message)
//                     if(data.success) {
//                         respuesta = { message: data.message }
//                     } else {
//                         respuesta = { message: data.message }
//                     }
//                 }
//                 break;
//             case 'pedido':
//                 if(parametros.number) {
//                 const data = await new GestionChatbot().obtenerPedidos(parametros.number, usuarioID, message)
//                     if(data.success) {
//                         respuesta = { message: data.message }
//                     } else {
//                         respuesta = { message: data.message }
//                     }
//                 }
//                 break;
//             case 'devolucion':
//                 if(parametros.number) {
//                     const data = await new GestionChatbot().obtenerDevoluciones(parametros.number, usuarioID, message)
//                     if(data.success) {
//                         respuesta = { message: data.message }
//                     } else {
//                         respuesta = { message: data.message }
//                     }
//                 }
//                 break;
//             case 'carrito':
//                 if(parametros.number.length > 1) {
//                     const data = await new GestionChatbot().agregarCarrito(usuarioID, null, parametros.number[1], parametros.number[0], message)
//                     if(data.success) {
//                         respuesta = { message: data.message, producto: data.producto, cantidad: data.cantidad }
//                     } else {
//                         respuesta = { message: data.message }
//                     }
//                 } else if (parametros.elemento && parametros.number) {
//                     const data = await new GestionChatbot().agregarCarrito(usuarioID, parametros.elemento, null, parametros.number, message)
//                     if(data.success) {
//                         respuesta = { message: data.message, producto: data.producto, cantidad: data.cantidad }
//                     } else {
//                         respuesta = { message: data.message }
//                     }
//                 } else {
//                     respuesta = { message: 'Error al agregar al carro' }
//                 }
               
//                 break;
//             default:
//                 respuesta = { message: interpretacion.error || 'No se pudo interpretar tu solicitud.' };
//         }

//         res.status(201).json({ success: true, message: respuesta.message, producto: respuesta.producto, cantidad: respuesta.cantidad })
//     } catch (error) { next(error) }
// }

// const obtenerChat = async (req, res, next) => {
//     const usuarioID = 4;
//     // const { usuarioID } = req.params;
//     try {
//         if(!usuarioID) {
//             const error = new Error('Usuario no valido')
//             error.statusCode = 403
//             throw error
//         }

//         const data = await new GestionChatbot().obtenerChat(usuarioID)
//         if(!data.success) {
//             const error = new Error(data.message)
//             error.statusCode = 404
//             throw error
//         }

//         res.status(200).json({ success: true, data: data.message })
//     } catch(e) { next(e) }
// }


module.exports = {
    // chatFunction,
    // obtenerChat,
    chatDeepseek,
}