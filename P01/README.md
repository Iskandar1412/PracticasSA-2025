## Manual Técnico

### Single Responsibility Principle (SRP)

Las clases/módulos deben tener únicamente una responsabilidad o razon para cambiar.
Para dicho principio se establece que cada clase o función debe tener una tarea o propósito, haciendo que el código pueda ser más facil de entender, mantener y probar.

- Ejemplo:

```js
class Producto {
    constructor(p_nombre, p_cantidad, p_precio) {
        this.p_nombre = p_nombre;
        this.p_cantidad = p_cantidad;
        this.p_precio = p_precio;
    }

    obtenerProducto() {
        return {
            p_nombre: this.p_nombre,
            p_cantidad: this.p_cantidad,
            p_precio: this.p_precio
        }
    }
}

class Inventario {
    constructor() {
        this.productos = [];
    }

    agregarProducto(producto) {
        if(!producto || !producto.p_nombre || producto.p_cantidad < 0 || producto.p_precio < 0) {
            throw new Error("Error en los datos");
        }
        this.productos.push(producto);
    }

    eliminarProducto(nombre) {
        const longitud = this.productos.length;
        this.productos = this.productos.filter(p => p.p_nombre !== nombre);
        return this.productos.length < longitud;
    }

    mostrarProductos() {
        return this.productos.map(p => p.toJSON());
    }
}

const inventario = new Inventario();
inventario.agregarProducto(new Producto("Asus Strix", 10, 15000));
console.log(inventario.mostrarProductos());
```

Para el ejemplo se puede ver que producto representa un producto, mientras que el inventario gestiona los productos.

### Open/Closed Principle (OCP)

Para este principio el código debe ser diseñado de manera que se pueda extender sin la necesidad de modificar el código existente. Ello permite la adicción de funcionalidades nuevas sin afectar o dañar el comportamiento que tenía inicialmente el código.

- Ejemplo:

```js
class Producto {
    constructor(p_nombre, p_cantidad, p_precio) {
        this.p_nombre = p_nombre;
        this.p_cantidad = p_cantidad;
        this.p_precio = p_precio;
    }

    obtenerProducto() {
        return {
            p_nombre: this.p_nombre,
            p_cantidad: this.p_cantidad,
            p_precio: this.p_precio
        }
    }
}

class Inventario {
    constructor() {
        this.productos = [];
    }

    agregarProducto(producto) {
        if(!producto || !producto.p_nombre || producto.p_cantidad < 0 || producto.p_precio < 0) {
            throw new Error("Error en los datos");
        }
        this.productos.push(producto);
    }

    eliminarProducto(nombre) {
        const longitud = this.productos.length;
        this.productos = this.productos.filter(p => p.p_nombre !== nombre);
        return this.productos.length < longitud;
    }

    mostrarProductos() {
        return this.productos.map(p => p.toJSON());
    }
}

class Electronicos extends Producto {
    constructor(p_nombre, p_cantidad, p_precio, p_garantia) {
        super(p_nombre, p_cantidad, p_precio);
        this.p_garantia = p_garantia;
    }

    obtenerProducto() {
        const base = super.obtenerProducto();
        return { ...base, p_garantia: this.p_garantia; };
    }
}
```

En este ejemplo podemos ver Electronicos (clase) la cual hereda de Producto, donde no modifica el código ya existente.

### Liskov Substitution Principle (LSP)

Para este principio, se asegura que las subclases sean intercambiables con sus clases principales (herencia?).

- Ejemplo:

```js
class Producto {
    constructor(p_nombre, p_cantidad, p_precio) {
        this.p_nombre = p_nombre;
        this.p_cantidad = p_cantidad;
        this.p_precio = p_precio;
    }

    obtenerProducto() {
        return {
            p_nombre: this.p_nombre,
            p_cantidad: this.p_cantidad,
            p_precio: this.p_precio
        }
    }
}

class Inventario {
    constructor() {
        this.productos = [];
    }

    agregarProducto(producto) {
        if(!producto || !producto.p_nombre || producto.p_cantidad < 0 || producto.p_precio < 0) {
            throw new Error("Error en los datos");
        }
        this.productos.push(producto);
    }

    eliminarProducto(nombre) {
        const longitud = this.productos.length;
        this.productos = this.productos.filter(p => p.p_nombre !== nombre);
        return this.productos.length < longitud;
    }

    mostrarProductos() {
        return this.productos.map(p => p.toJSON());
    }
}

class Electronicos extends Producto {
    constructor(p_nombre, p_cantidad, p_precio, p_garantia) {
        super(p_nombre, p_cantidad, p_precio);
        this.p_garantia = p_garantia;
    }

    obtenerProducto() {
        const base = super.obtenerProducto();
        return { ...base, p_garantia: this.p_garantia; };
    }
}

const inventario = new Inventario();
inventario.agregarProducto(new Producto("Samsung GX29999", 200, 9877.50));
inventario.agregarProducto(new Electronicos("Samsung Refri", 20, 15000.99, "1 año"));
```

Para este ejemplo como tenemos una herencia (Electronicos que hereda de Producto) la utilizamos en lugar de Producto que se tomaría como un Producto (ya que hereda de ello).

### Interface Segregation Principle (ISP)

Este principio da a entender que las interfaces deben ser pequeñas y por lo menos lo más específicas (sin la necesidad de ser grandes y genéricas), para que las clases hijas posteriores implementen métodos que requieran.

- Ejemplo:

```js
class Producto {
    obtenerProducto() {
        return {
            p_nombre: this.p_nombre,
            p_cantidad: this.p_cantidad,
            p_precio: this.p_precio
        }
    }
}

class Electronicos extends Producto {
    obtenerProducto() {
        const base = super.obtenerProducto();
        return { ...base, p_garantia: this.p_garantia; };
    }
}
```

Como se puede ver en el ejemplo del código, la clase hija (Electronicos) implementa una nueva característica (garantia) sin afectar la interfáz inicial (Productos).

### Dependency Inversion Principle (DIP)

Aqui el código debe depender de interfaces o abstracciones en lugar de implemnentaciones concretas, permitiendo el cambio posterior mediante implementaciones sin la necesidad de afectar el resto del código.

- Ejemplo:

```js
class Almacenamiento {
    guardar(data) {
        throw new Error("Se deve implementar método de guardado")
    }

    cargar() {
        throw new Error("Se debe implementar método de carga")
    }
}

class MemoriaAlmacenar extends Almacenamiento {
    constructor() {
        super();
        this.data = [];
    }

    guardar(data) {
        this.data = data;
    }

    cargar() {
        return this.data;
    }
}

class Inventario {
    constructor(almacenamiento) {
        this.alamacenamiento = almacenamiento;
        this.productos = this.almacenamiento.cargar();
    }

    agregarProducto(producto) {
        this.productos.push(producto);
        this.alamacenamiento.guardar(this.producto);
    }

    mostrarProductos() {
        return this.productos.map(p => p.toJSON());
    }
}

class Producto {
    constructor(p_nombre, p_cantidad, p_precio) {
        this.p_nombre = p_nombre;
        this.p_cantidad = p_cantidad;
        this.p_precio = p_precio;
    }

    obtenerProducto() {
        return {
            p_nombre: this.p_nombre,
            p_cantidad: this.p_cantidad,
            p_precio: this.p_precio
        }
    }
}

const memoria = new MemoriaAlmacenar();
const inventario = new Inventario(memoria);
inventario.agregarProducto(new Producto("Huawei P60 Pro Plus Ultra Plus". 15, 20000.94));
console.log(inventario.mostrarProductos());
```

Si se mira, inventario depende de una abstracción (MemoriaAlmacenar) en vez de una implementación concreta.