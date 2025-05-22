CREATE DATABASE MS_PR4_Album;
USE MS_PR4_Album;

CREATE TABLE Album (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    artista_id INT NOT NULL,
    fecha_lanzamiento DATE,
    genero_musical VARCHAR(50)
);

CREATE DATABASE MS_PR4_Artista;
USE MS_PR4_Artista;

CREATE TABLE Artista (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    genero_musical VARCHAR(50),
    pais_origen VARCHAR(50)
);

CREATE DATABASE MS_PR4_Cancion;
USE MS_PR4_Cancion;

CREATE TABLE Cancion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    duracion INT NOT NULL,
    artista_id INT NOT NULL,
    album_id INT NOT NULL,
    fecha_lanzamiento DATE
);

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