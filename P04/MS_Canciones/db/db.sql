CREATE DATABASE MS_PR4_Cancion;

CREATE TABLE Cancion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    duracion INT NOT NULL,
    artista_id INT NOT NULL,
    album_id INT NOT NULL,
    fecha_lanzamiento DATE
);

-- CREATE TABLE canciones (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     titulo VARCHAR(100) NOT NULL,
--     duracion INT NOT NULL,
--     artista_id INT,
--     album_id INT,
--     fecha_lanzamiento DATE,
--     FOREIGN KEY (artista_id) REFERENCES Artistas(id),
--     FOREIGN KEY (album_id) REFERENCES Albumes(id)
-- );