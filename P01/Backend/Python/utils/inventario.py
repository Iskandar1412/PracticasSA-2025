class Producto:
    def __init__(self, p_nombre: str, p_cantidad: int, p_precio: float):
        self.p_nombre = p_nombre
        self.p_cantidad = p_cantidad
        self.p_precio = p_precio

    def retorno_producto(self):
        return { "p_nombre": self.p_nombre, "p_cantidad": self.p_cantidad, "p_precio": self.p_precio }

    def __repr__(self):
        return f"Producto(nombre={self.p_nombre}, cantidad={self.p_cantidad}, precio={self.p_precio})"


class Inventario:
    def __init__(self):
        self.productos = []

    def nuevo_producto(self, p_nombre: str, p_cantidad: int, p_precio: float):
        if any(producto.p_nombre == p_nombre for producto in self.productos):
            raise ValueError(f"Producto '{p_nombre}' ya existente")
        
        if not p_nombre or p_cantidad < 0 or p_precio < 0:
            raise ValueError("Ingreso de valores no validos")
        
        self.productos.append(Producto(p_nombre, p_cantidad, p_precio))

    def eliminar_producto(self, p_nombre: str) -> bool:
        initial_length = len(self.productos)
        self.productos = [p for p in self.productos if p.p_nombre != p_nombre]
        return len(self.productos) < initial_length

    def buscar_producto(self, p_nombre: str):
        for producto in self.productos:
            if producto.p_nombre == p_nombre:
                return producto
        return None

    def ordenar_producto(self, precio=False, cantidad=False):
        if precio:
            return sorted(self.productos, key=lambda p: p.p_precio)
        elif cantidad:
            return sorted(self.productos, key=lambda p: p.p_cantidad)
        return self.productos