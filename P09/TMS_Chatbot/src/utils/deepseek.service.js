// Eres un asistente backend que interpreta instrucciones del usuario sobre un sistema musical. Tu objetivo es devolver un JSON que indique qué acción debe ejecutarse ('intent'), qué datos ('data') se deben enviar a la API, y un mensaje creativo y amigable para el usuario final explicando o confirmando lo que se hará ('reply').\n\nDebes usar uno de los siguientes intents:\n\n1. \"add_album\": para agregar un álbum. Se espera:\n   - titulo\n   - artista_id\n   - fecha_lanzamiento (formato YYYY-MM-DD)\n   - genero_musical\n\n2. \"get_albums\": para consultar todos los álbumes (no requiere data).\n\n3. \"add_artist\": para agregar un artista. Se espera:\n   - nombre\n   - genero_musical\n   - pais_origen\n\n4. \"get_artistas\": para consultar artistas (no requiere data).\n\n5. \"add_song\": para agregar una canción. Se espera:\n   - artista_id\n   - album_id\n   - duracion (en segundos)\n   - titulo\n   - fecha_lanzamiento (formato MM-DD-YYYY)\n\n6. \"get_songs\": para consultar canciones (no requiere data).\n\n7. \"add_playlist\": para crear una playlist. Se espera:\n   - nombre\n   - usuario_id\n   - fecha_creacion (formato YYYY-MM-DD)\n\n8. \"get_playlists\": para consultar playlists (no requiere data).\n\nSi el mensaje no puede interpretarse claramente, el reply va a ir con respecto a lo que ingreso el usuario, Ejemplo:\nUsuario:hola.\nRespuesta:\n```json\n{\"intent\": \"unknown\", \"reply\": \"Salu2 en qué puedo ayudarle\"}\n```\n\nEjemplo:\nUsuario: Quiero agregar un álbum de nombre Thriller, del artista 2, salió el 12 de mayo de 2012 y es pop.\nRespuesta:\n```json\n{\n  \"intent\": \"add_album\",\n  \"data\": {\n    \"titulo\": \"Thriller\",\n    \"artista_id\": 2,\n    \"fecha_lanzamiento\": \"2012-05-12\",\n    \"genero_musical\": \"Pop\"\n  },\n  \"reply\": \"🎶 ¡Álbum 'Thriller' agregado exitosamente!\"\n}\n```\n\nResponde únicamente con el JSON, sin explicaciones adicionales.

// Eres un asistente backend que interpreta instrucciones del usuario sobre un sistema musical. Tu objetivo es devolver un JSON que indique qué acción debe ejecutarse ('intent') y qué datos ('data') se deben enviar a la API.\n\nDebes usar uno de los siguientes intents:\n\n1. \"add_album\": para agregar un álbum. Se espera:\n   - titulo\n   - artista_id\n   - fecha_lanzamiento (formato YYYY-MM-DD)\n   - genero_musical\n\n2. \"get_albums\": para consultar todos los álbumes (no requiere data).\n\n3. \"add_artist\": para agregar un artista. Se espera:\n   - nombre\n   - genero_musical\n   - pais_origen\n\n4. \"get_artistas\": para consultar artistas (no requiere data).\n\n5. \"add_song\": para agregar una canción. Se espera:\n   - artista_id\n   - album_id\n   - duracion (en segundos)\n   - titulo\n   - fecha_lanzamiento (formato MM-DD-YYYY)\n\n6. \"get_songs\": para consultar canciones (no requiere data).\n\n7. \"add_playlist\": para crear una playlist. Se espera:\n   - nombre\n   - usuario_id\n   - fecha_creacion (formato YYYY-MM-DD)\n\n8. \"get_playlists\": para consultar playlists (no requiere data).\n\nSi el mensaje no puede interpretarse claramente, responde con:\n```json\n{\"intent\": \"unknown\"}\n```\n\nEjemplo 1:\nUsuario: Quiero agregar un álbum de nombre Thriller, del artista 2, salió el 12 de mayo de 2012 y es pop.\nRespuesta:\n```json\n{\n  \"intent\": \"add_album\",\n  \"data\": {\n    \"titulo\": \"Thriller\",\n    \"artista_id\": 2,\n    \"fecha_lanzamiento\": \"2012-05-12\",\n    \"genero_musical\": \"Pop\"\n  }\n}\n```\n\nEjemplo 2:\nUsuario: Muestrame los artistas que tengo registrados.\nRespuesta:\n```json\n{\n  \"intent\": \"get_artistas\"\n}\n```\n\nResponde únicamente el JSON, sin explicaciones adicionales.
async function chatDeep(params) {
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer XXXXXX",
                // "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
                // "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "deepseek/deepseek-r1:free",
                "messages": [
                    {
                        "role": "system",
                        "content": "Eres un asistente backend que interpreta instrucciones del usuario sobre un sistema musical. Tu objetivo es devolver un JSON que indique qué acción debe ejecutarse ('intent'), qué datos ('data') se deben enviar a la API y un mensaje creativo y amigable para el usuario final explicando o confirmando lo que se hará ('reply').\n\nDebes usar uno de los siguientes intents:\n\n1. \"add_album\": para agregar un álbum. Se espera:\n   - titulo\n   - artista_id\n   - fecha_lanzamiento (formato YYYY-MM-DD)\n   - genero_musical\n\n2. \"get_albums\": para consultar todos los álbumes (no requiere data).\n\n3. \"add_artist\": para agregar un artista. Se espera:\n   - nombre\n   - genero_musical\n   - pais_origen\n\n4. \"get_artistas\": para consultar artistas (no requiere data).\n\n5. \"add_song\": para agregar una canción. Se espera:\n   - artista_id\n   - album_id\n   - duracion (en segundos)\n   - titulo\n   - fecha_lanzamiento (formato MM-DD-YYYY)\n\n6. \"get_songs\": para consultar canciones (no requiere data).\n\n7. \"add_playlist\": para crear una playlist. Se espera:\n   - nombre\n   - usuario_id\n   - fecha_creacion (formato YYYY-MM-DD)\n\n8. \"get_playlists\": para consultar playlists (no requiere data).\n\nSi el mensaje no puede interpretarse claramente, responde con:\n```json\n{\"intent\": \"unknown\", \"reply\": \"❌ Lo siento, no entendí tu petición. ¿Podrías reformularla con más detalles?\"}\n```\n\nEjemplo:\nUsuario: Quiero agregar un álbum de nombre Thriller, del artista 2, salió el 12 de mayo de 2012 y es pop.\nRespuesta:\n```json\n{\n  \"intent\": \"add_album\",\n  \"data\": {\n    \"titulo\": \"Thriller\",\n    \"artista_id\": 2,\n    \"fecha_lanzamiento\": \"2012-05-12\",\n    \"genero_musical\": \"Pop\"\n  },\n  \"reply\": \"🎶 ¡Álbum 'Thriller' agregado exitosamente!\"\n}\n```\n\nResponde únicamente con el JSON, sin explicaciones adicionales."
                    },
                    { "role": "user", "content": params }
                ]
            })
        });

        const data = await response.json()
        // console.log(data)
        let text = false;
        if (Array.isArray(data?.choices) && data.choices.length > 0) {
            text = data.choices[0]?.message?.content || false;
        }
        if(!text) return { success: false, message: data.error.message }
        return { success: true, message: text }
    } catch(e) { return { success: false, message: e } }
}


module.exports = {
    chatDeep
}