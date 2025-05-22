* docker run --name sa -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=iskandar mysql:latest

* docker exec -it sa mysql -uroot -piskandar

* Crear imágenes docker

```bash
docker build -t <nombre-imagen> <ruta-dockerfile>

docker build -t ejemplo . # en este caso estamos en la carpeta del dockerfile por eso el "."
```

* Correr imagen

```bash
docker run -d -p <port>:<port> --name <contenedor> <nombre-imagen>
    -d => segundo plano
    -p <port>:<port> => puerto
    --name <contenedor> => nombramos el contenedor
    <nombre-imagen> => nombre de imagen que creamos
```
