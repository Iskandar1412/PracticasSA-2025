// quiero que me mostres todas las canciones
// quiero que me mostres todas los artistas
// quiero que me mostres todos los albumes
// quiero que me mostres todas las playlists

const testCases = [
    {
      input: "Agrega un artista llamado Shakira que es de Colombia y canta pop",
      expected: {
        intent: "add_artist",
        data: {
          nombre: "Shakira",
          pais_origen: "Colombia",
          genero_musical: "Pop"
        }
      }
    },
    {
      input: "Registrar el álbum Thriller, del artista 1, género Pop, fecha 2010-01-01",
      expected: {
        intent: "add_album",
        data: {
          titulo: "Thriller",
          artista_id: 1,
          fecha_lanzamiento: "2010-01-01",
          genero_musical: "Pop"
        }
      }
    },
    {
      input: "Agrega una canción titulada Morfonica del álbum 1, del artista 2, dura 150 segundos y salió el 25 de diciembre de 2025",
      expected: {
        intent: "add_song",
        data: {
          artista_id: 2,
          album_id: 1,
          duracion: 150,
          titulo: "Morfonica",
          fecha_lanzamiento: "12-25-2025"
        }
      }
    },
    {
      input: "Crea una playlist llamada Favoritas del usuario 2 creada el 2020-06-01",
      expected: {
        intent: "add_playlist",
        data: {
          nombre: "Favoritas",
          usuario_id: 2,
          fecha_creacion: "2020-06-01"
        }
      }
    },
    {
      input: "Muéstrame todos los artistas",
      expected: {
        intent: "get_artistas"
      }
    },
    {
      input: "Listame los álbumes disponibles",
      expected: {
        intent: "get_albums"
      }
    },
    {
      input: "Dime cuántas canciones hay",
      expected: {
        intent: "get_songs"
      }
    },
    {
      input: "Quiero ver las playlists que tengo",
      expected: {
        intent: "get_playlists"
      }
    },
    {
      input: "Hazme feliz",
      expected: {
        intent: "unknown"
      }
    }
  ];
  
  async function testDeepseekInterpreter(sendToDeepseek, parseFn) {
    for (const testCase of testCases) {
      const response = await sendToDeepseek(testCase.input);
      const parsed = parseFn(response.message); // asumiendo formato con ```json
      console.log(`Entrada: ${testCase.input}`);
      console.log(`Intento detectado: ${parsed.intent}`);
      if (parsed.intent !== testCase.expected.intent) {
        console.error("❌ ERROR: Intento incorrecto\n");
        continue;
      }
  
      if (testCase.expected.data) {
        const missing = Object.entries(testCase.expected.data).filter(
          ([key, val]) => parsed.data?.[key] !== val
        );
        if (missing.length > 0) {
          console.error(`❌ ERROR: Campos incorrectos o faltantes: ${JSON.stringify(missing)}\n`);
          continue;
        }
      }
  
      console.log("✅ Test exitoso\n");
    }
  }
  
  // Exporta si quieres usarlo con Jest o como script
  module.exports = { testDeepseekInterpreter, testCases };
  