CREATE DATABASE MS_PR4_Artista;
USE MS_PR4_Artista;
CREATE TABLE Artista (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    genero_musical VARCHAR(50),
    pais_origen VARCHAR(50)
);