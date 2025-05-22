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

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

type Playlist struct {
	ID            int    `json:"id"`
	Nombre        string `json:"nombre"`
	UsuarioID     int    `json:"usuario_id"`
	FechaCreacion string `json:"fecha_creacion"`
}

var db *sql.DB

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error cargando el archivo .env")
	}

	connStr := "root:iskandar@tcp(" + os.Getenv("DB_HOST_MS_REPRODUCCION") + ":3306)/MS_PR4_Reproduccion"

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

	r.POST("/playlists", agregarPlaylist)
	r.GET("/playlists", obtenerPlaylists)
	r.GET("/playlists/:id", obtenerPlaylistPorID)

	r.Run(":5400")
}

func agregarPlaylist(c *gin.Context) {
	var nuevaPlaylist Playlist
	if err := c.ShouldBindJSON(&nuevaPlaylist); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := db.Exec(
		"INSERT INTO Playlist (nombre, usuario_id) VALUES (?, ?)",
		nuevaPlaylist.Nombre, nuevaPlaylist.UsuarioID,
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

	nuevaPlaylist.ID = int(id)
	nuevaPlaylist.FechaCreacion = ""

	c.JSON(http.StatusCreated, nuevaPlaylist)
}

func obtenerPlaylists(c *gin.Context) {
	rows, err := db.Query("SELECT id, nombre, usuario_id FROM Playlist")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var playlists []Playlist
	for rows.Next() {
		var playlist Playlist
		if err := rows.Scan(&playlist.ID, &playlist.Nombre, &playlist.UsuarioID); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		playlists = append(playlists, playlist)
	}
	c.JSON(http.StatusOK, playlists)
}

func obtenerPlaylistPorID(c *gin.Context) {
	id := c.Param("id")
	var playlist Playlist
	err := db.QueryRow("SELECT id, nombre, usuario_id FROM Playlist WHERE id = ?", id).Scan(
		&playlist.ID, &playlist.Nombre, &playlist.UsuarioID,
	)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Playlist no encontrada"})
		return
	}
	c.JSON(http.StatusOK, playlist)
}
