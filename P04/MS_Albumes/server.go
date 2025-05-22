package main

/*
go mod init main
go get github.com/gin-gonic/gin
go get github.com/go-sql-driver/mysql
go get github.com/joho/godotenv
*/

import (
	"database/sql"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

type Album struct {
	ID                int    `json:"id"`
	Titulo            string `json:"titulo"`
	Artista_id        int    `json:"artista_id"`
	Fecha_lanzamiento string `json:"fecha_lanzamiento"`
	Genero_musical    string `json:"genero_musical"`
}

var db *sql.DB

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error cargando el archivo .env")
	}

	connStr := "root:iskandar@tcp(" + os.Getenv("DB_HOST_MS_ALBUMES") + ":3306)/MS_PR4_Album"

	db, err = sql.Open("mysql", connStr)
	if err != nil {
		log.Fatal("Error conectando a la base de datos:", err)
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		log.Fatal("Error verificando la conexión a la base de datos:", err)
	}

	r := gin.Default()

	r.POST("/albums", agregarAlbum)
	r.GET("/albums", obtenerAlbum)
	r.GET("/albums/:id", obtenerAlbumPorID)

	r.Run(":5100")
}

func agregarAlbum(c *gin.Context) {
	var nuevoAlbum Album
	if err := c.ShouldBindJSON(&nuevoAlbum); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := time.Parse("2006-01-02", nuevoAlbum.Fecha_lanzamiento)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Formato de fecha inválido. Use YYYY-MM-DD"})
		return
	}

	result, err := db.Exec(
		"INSERT INTO Album (titulo, artista_id, fecha_lanzamiento, genero_musical) VALUES (?, ?, ?, ?)",
		nuevoAlbum.Titulo, nuevoAlbum.Artista_id, nuevoAlbum.Fecha_lanzamiento, nuevoAlbum.Genero_musical,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	id, err := result.LastInsertId()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	nuevoAlbum.ID = int(id)

	c.JSON(http.StatusCreated, nuevoAlbum)
}

func obtenerAlbum(c *gin.Context) {
	rows, err := db.Query("SELECT id, titulo, artista_id, fecha_lanzamiento, genero_musical FROM Album")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var playlists []Album
	for rows.Next() {
		var album Album
		if err := rows.Scan(&album.ID, &album.Titulo, &album.Artista_id, &album.Fecha_lanzamiento, &album.Genero_musical); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		playlists = append(playlists, album)
	}
	c.JSON(http.StatusOK, playlists)
}

func obtenerAlbumPorID(c *gin.Context) {
	id := c.Param("id")
	var album Album
	err := db.QueryRow("SELECT id, titulo, artista_id, fecha_lanzamiento, genero_musical FROM Album WHERE id = ?", id).Scan(
		&album.ID, &album.Titulo, &album.Artista_id, &album.Fecha_lanzamiento, &album.Genero_musical,
	)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Album no encontrada"})
		return
	}
	c.JSON(http.StatusOK, album)
}
