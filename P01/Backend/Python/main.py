from flask import Flask, jsonify, request
from utils.inventario import Inventario

app = Flask(__name__)
controlador = Inventario()

@app.route('/productos', methods=['GET'])
def list_products():
    return jsonify([producto.retorno_producto() for producto in controlador.productos])

@app.route('/productos/agregar', methods=['POST'])
def nuevo_producto():
    data = request.json
    try:
        controlador.nuevo_producto(data['p_nombre'], data['p_cantidad'], data['p_precio'])
        return jsonify({"message": "Producto agregado exitosamente"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/productos/quitar/<string:p_nombre>', methods=['DELETE'])
def eliminar_producto(p_nombre):
    success = controlador.eliminar_producto(p_nombre)
    if success:
        return jsonify({"message": f"Producto '{p_nombre}' eliminado"})
    return jsonify({"error": "Producto no encontrado (inexistente)"}), 404

@app.route('/productos/buscar/<string:p_nombre>', methods=['GET'])
def buscar_producto(p_nombre):
    producto = controlador.buscar_producto(p_nombre)
    if producto:
        return jsonify(producto.retorno_producto())
    return jsonify({"error": "Producto no encontrado (inexistente)"}), 404

@app.route('/productos/sortear', methods=['GET'])
def ordenar_producto():
    precio = request.args.get('precio', False, type=bool)
    cantidad = request.args.get('cantidad', False, type=bool)
    productos_ordenados = controlador.ordenar_producto(precio=precio, cantidad=cantidad)
    return jsonify([producto.retorno_producto() for producto in productos_ordenados])

if __name__ == "__main__":
    app.run(debug=True, port=3200)