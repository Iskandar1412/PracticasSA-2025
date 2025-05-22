// go mod init Go
// go get -u github.com/gorilla/mux
// go get -u github.com/gin-gonic/gin
// go get -u github.com/rs/cors
// go mod tidy
package main

import (
    "encoding/json"
    "net/http"
    "strconv"

    "github.com/gorilla/mux"
    "Go/utils"
	"fmt"
    "github.com/rs/cors"
)

var controlador = utils.NuevoInventario()

func main() {
    r := mux.NewRouter()
    c := cors.AllowAll()

    r.HandleFunc("/productos", listarProductos).Methods("GET")
    r.HandleFunc("/productos/agregar", agregarProducto).Methods("POST")
    r.HandleFunc("/productos/quitar/{p_nombre}", eliminarProducto).Methods("DELETE")
    r.HandleFunc("/productos/buscar/{p_nombre}", buscarProducto).Methods("GET")
    r.HandleFunc("/productos/sortear", ordenarProductos).Methods("GET")

    handler := c.Handler(r)

	fmt.Println("Servidor de Go corriendo en puerto 3200")
    http.ListenAndServe(":3200", handler)
}

func listarProductos(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    productos := controlador.ListarProductos()
    json.NewEncoder(w).Encode(productos)
}

func agregarProducto(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    var producto utils.Producto
    err := json.NewDecoder(r.Body).Decode(&producto)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    err = controlador.NuevoProducto(producto.PNombre, producto.PCantidad, producto.PPrecio)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(map[string]string{"message": "Producto agregado exitosamente"})
}

func eliminarProducto(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    params := mux.Vars(r)
    pNombre := params["p_nombre"]
    success := controlador.EliminarProducto(pNombre)
    if success {
        json.NewEncoder(w).Encode(map[string]string{"message": "Producto eliminado"})
    } else {
        http.Error(w, "Producto no encontrado (inexistente)", http.StatusNotFound)
    }
}

func buscarProducto(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    params := mux.Vars(r)
    pNombre := params["p_nombre"]
    producto := controlador.BuscarProducto(pNombre)
    if producto != nil {
        json.NewEncoder(w).Encode(producto)
    } else {
        http.Error(w, "Producto no encontrado (inexistente)", http.StatusNotFound)
    }
}

func ordenarProductos(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    precioStr := r.URL.Query().Get("precio")
    cantidadStr := r.URL.Query().Get("cantidad")

    precio, _ := strconv.ParseBool(precioStr)
    cantidad, _ := strconv.ParseBool(cantidadStr)

    productosOrdenados := controlador.OrdenarProductos(precio, cantidad)
    json.NewEncoder(w).Encode(productosOrdenados)
}