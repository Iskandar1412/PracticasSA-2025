const express = require('express');
const cors = require('cors');
const { Inventario } = require('./utils/inventario');

const app = express();
app.use(express.json());
// Uso de cors para aceptar peticiones front (se puede ajustar más dependiendo de lo que se requiera)
app.use(cors());

const controlador = new Inventario();

// Endpoint para obtener productos ej: /productos
app.get('/productos', (req, res) => {
    const productos = controlador.listarProductos();
    res.json(productos.map(producto => producto.retornoProducto()));
});

// Endpoint para agregar productos ej: /productos/agregar
/*
{
    "p_nombre": "Pizza",
    "p_cantidad": 12,
    "p_precio": 12.52
}
*/
app.post('/productos/agregar', (req, res) => {
    const { p_nombre, p_cantidad, p_precio } = req.body;
    try {
        controlador.nuevoProducto(p_nombre, p_cantidad, p_precio);
        res.status(201).json({ message: "Producto agregado exitosamente" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Endpoint para eliminar los productos ej: /productos/quitar/Pizza
app.delete('/productos/quitar/:p_nombre', (req, res) => {
    const { p_nombre } = req.params;
    const success = controlador.eliminarProducto(p_nombre);
    if (success) {
        res.json({ message: `Producto '${p_nombre}' eliminado` });
    } else {
        res.status(404).json({ error: "Producto no encontrado (inexistente)" });
    }
});

// Endpoint para buscar los productos ej: /productos/buscar/Pizza
app.get('/productos/buscar/:p_nombre', (req, res) => {
    const { p_nombre } = req.params;
    const producto = controlador.buscarProducto(p_nombre);
    if (producto) {
        res.json(producto.retornoProducto());
    } else {
        res.status(404).json({ error: "Producto no encontrado (inexistente)" });
    }
});

// Endpoint para ordenar los productos ej: /productos/sortear??precio=true&cantidad=true
app.get('/productos/sortear', (req, res) => {
    const { precio, cantidad } = req.query;
    const productosOrdenados = controlador.ordenarProducto(
        precio === 'true',
        cantidad === 'true'
    );
    res.json(productosOrdenados.map(producto => producto.retornoProducto()));
});

// Puerto en el que se conectará con el backend
const PORT = 3200;
app.listen(PORT, () => {
    console.log(`Servidor en puerto '${PORT}'`);
});