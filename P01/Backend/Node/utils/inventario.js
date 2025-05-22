class Producto {
    constructor(p_nombre, p_cantidad, p_precio) {
        this.p_nombre = p_nombre;
        this.p_cantidad = p_cantidad;
        this.p_precio = p_precio;
    }

    retornoProducto() {
        return {
            p_nombre: this.p_nombre,
            p_cantidad: this.p_cantidad,
            p_precio: this.p_precio
        };
    }

    toString() {
        return `Producto(nombre=${this.p_nombre}, cantidad=${this.p_cantidad}, precio=${this.p_precio})`;
    }
}

class Inventario {
    constructor() {
        this.productos = [];
    }

    nuevoProducto(p_nombre, p_cantidad, p_precio) {
        if (this.productos.some(producto => producto.p_nombre === p_nombre)) {
            throw new Error(`Producto '${p_nombre}' ya existente`);
        }

        if (!p_nombre || p_cantidad < 0 || p_precio < 0) {
            throw new Error("Ingreso de valores no válidos");
        }

        this.productos.push(new Producto(p_nombre, p_cantidad, p_precio));
    }

    eliminarProducto(p_nombre) {
        const initialLength = this.productos.length;
        this.productos = this.productos.filter(producto => producto.p_nombre !== p_nombre);
        return this.productos.length < initialLength;
    }

    buscarProducto(p_nombre) {
        return this.productos.find(producto => producto.p_nombre === p_nombre) || null;
    }

    ordenarProducto(precio = false, cantidad = false) {
        if (precio) {
            return this.productos.sort((a, b) => a.p_precio - b.p_precio);
        } else if (cantidad) {
            return this.productos.sort((a, b) => a.p_cantidad - b.p_cantidad);
        }
        return this.productos;
    }

    listarProductos() {
        return this.productos;
    }
}

module.exports = { Inventario };