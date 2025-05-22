CREATE DATABASE MS_PR4_Reproduccion;
USE MS_PR4_Reproduccion;
CREATE TABLE Playlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    usuario_id INT NOT NULL
);

CREATE TABLE Playlist_cancion (
    playlist_id INT,
    cancion_id INT NOT NULL,
    PRIMARY KEY (playlist_id),
    FOREIGN KEY (playlist_id) REFERENCES Playlist(id)
);

-- CREATE TABLE playlists (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     nombre VARCHAR(100) NOT NULL,
--     usuario_id INT,
--     fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE playlist_canciones (
--     playlist_id INT,
--     cancion_id INT,
--     PRIMARY KEY (playlist_id, cancion_id),
--     FOREIGN KEY (playlist_id) REFERENCES playlists(id),
--     FOREIGN KEY (cancion_id) REFERENCES canciones(id)
-- );