## Docker acepte en cualquier puerto (mas si es kubernetes local <se le agrega --bind-address=0.0.0.0>)

- docker run --name sa -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=iskandar mysql:latest --bind-address=0.0.0.0

- docker exec -it sa mysql -uroot -piskandar


- paru -S openbsd-netcat

- nc -zv 127.0.0.1 3306


- ip a | grep inet
    inet 127.0.0.1/8 scope host lo
    inet6 ::1/128 scope host noprefixroute 
    inet 192.168.0.13/24 brd 192.168.0.255 scope global dynamic noprefixroute wlan0
    inet6 2803:d100:e940:593:c832:a448:418b:21d2/64 scope global dynamic noprefixroute 
    inet6 2803:d100:e940:593:486d:886f:49e0:49bb/64 scope global dynamic mngtmpaddr noprefixroute 
    inet6 fe80::8690:80ff:c04a:d735/64 scope link noprefixroute 
    inet6 fe80::9a72:7f48:cdc2:8584/64 scope link 
    **inet 172.17.0.1/16 brd 172.17.255.255 scope global docker0**

> en este caso se usar la ip de docker ya que el contenedor ya que se le puso lo otro

## Subir a dockerhub

* Creación imagen

```sh
docker build -t <aplicacion>:v1 .
```

* Etiquetar para subir a repo dockerhub

```sh
sudo docker tag <aplicacion>:v1 <usuario-hub>/<repo>:v1
```

* Subir al repo

```sh
sudo docker push <usuario-hub>/<repo>:v1
```
