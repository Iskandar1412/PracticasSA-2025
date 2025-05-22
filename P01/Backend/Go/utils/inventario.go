package utils

import (
    "errors"
    "sort"
)

type Producto struct {
    PNombre   string  `json:"p_nombre"`
    PCantidad int     `json:"p_cantidad"`
    PPrecio   float64 `json:"p_precio"`
}

type Inventario struct {
    productos []Producto
}

func NuevoInventario() *Inventario {
    return &Inventario{
        productos: []Producto{},
    }
}

func (i *Inventario) NuevoProducto(pNombre string, pCantidad int, pPrecio float64) error {
    if i.existeProducto(pNombre) {
        return errors.New("Producto '" + pNombre + "' ya existente")
    }
    if pNombre == "" || pCantidad < 0 || pPrecio < 0 {
        return errors.New("Ingreso de valores no válidos")
    }
    i.productos = append(i.productos, Producto{PNombre: pNombre, PCantidad: pCantidad, PPrecio: pPrecio})
    return nil
}

func (i *Inventario) existeProducto(pNombre string) bool {
    for _, producto := range i.productos {
        if producto.PNombre == pNombre {
            return true
        }
    }
    return false
}

func (i *Inventario) EliminarProducto(pNombre string) bool {
    initialLength := len(i.productos)
    i.productos = filter(i.productos, func(p Producto) bool {
        return p.PNombre != pNombre
    })
    return len(i.productos) < initialLength
}

func (i *Inventario) BuscarProducto(pNombre string) *Producto {
    for _, producto := range i.productos {
        if producto.PNombre == pNombre {
            return &producto
        }
    }
    return nil
}

func (i *Inventario) OrdenarProductos(precio bool, cantidad bool) []Producto {
    if precio {
        sort.Slice(i.productos, func(a, b int) bool {
            return i.productos[a].PPrecio < i.productos[b].PPrecio
        })
    } else if cantidad {
        sort.Slice(i.productos, func(a, b int) bool {
            return i.productos[a].PCantidad < i.productos[b].PCantidad
        })
    }
    return i.productos
}

func (i *Inventario) ListarProductos() []Producto {
    return i.productos
}

func filter(productos []Producto, condicion func(Producto) bool) []Producto {
    result := []Producto{}
    for _, producto := range productos {
        if condicion(producto) {
            result = append(result, producto)
        }
    }
    return result
}