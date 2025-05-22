CREATE DATABASE MS_PR4_Album;
USE MS_PR4_Album;
CREATE TABLE Album (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    artista_id INT NOT NULL,
    fecha_lanzamiento DATE,
    genero_musical VARCHAR(50)
);

-- CREATE TABLE albumes (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     titulo VARCHAR(100) NOT NULL,
--     artista_id INT,
--     fecha_lanzamiento DATE,
--     genero_musical VARCHAR(50),
--     FOREIGN KEY (artista_id) REFERENCES artistas(id)
-- );