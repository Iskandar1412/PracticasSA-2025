# Documentación

## Comandos utilizados

### Base de Datos
> Docker acepte en cualquier puerto (mas si es kubernetes local <se le agrega --bind-address=0.0.0.0>)

- docker run --name sa -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=iskandar mysql:latest --bind-address=0.0.0.0

- docker exec -it sa mysql -uroot -piskandar

### Instalación Podman

```sh
paru -S podman

paru -S podman-desktop

podman --version
```

### Instalación KubeCTL

```sh
sudo pacman -S kubectl
kubectl version --client
```

### Instalación Kind

```sh
paru -S kind-bin

kind --version

systemctl --user enable podman.socket
systemctl --user start podman.socket

ls /sys/fs/cgroup
sudo stat -fc %T /sys/fs/group
```

> Configuar container.conf (en caso que no exista)

```shell
nvim ~/.config/containers/container.conf

## Dentro del archivo
[engine]
cgroup_manager = "systemd"

-- Cerrar archivo

export CGROUP_DRIVER=systemd
sudo loginctl enable-linger $user
```

### Creación Cluster

```shell
kind create cluster --config ./Cluster/cluster.yaml

kubectl get nodes
```

### Correr archivos de configuración

```shell
kubectl apply -f ./namespaces/namespace-project.yaml

kubectl apply -f ./config/configMap.yaml

kubectl apply -f ./Secrets/secret.yaml

kubectl apply -f ./Deploys/albumes.yaml

kubectl apply -f ./Deploys/artistas.yaml

kubectl apply -f ./Deploys/canciones.yaml

kubectl apply -f ./Deploys/reproducciones.yaml
```

### Ingress

```shell
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml

kubectl get svc -n ingress-nginx

kubectl label nodes kind-control-plane ingress-ready=true

kubectl port-forward -n ingress-nginx svc/ingress-nginx-controller 8080:80
```

## Archivos Despliegues Kubernetes

### Albumes

```yml
apiVersion: v1
kind: Service
metadata:
  name: ms-albumes
  namespace: proyecto-sa
spec:
  selector:
    app: ms-albumes
  ports:
    - protocol: TCP
      port: 5100
      targetPort: 5100
  type: ClusterIP
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ms-albumes
  namespace: proyecto-sa
  labels:
    app: ms-albumes
spec:
  selector:
    matchLabels:
      app: ms-albumes
  template:
    metadata:
      labels:
        app: ms-albumes
    spec:
      containers:
        - name: ms-albumes
          image: iskandar1412/pruebas-sa:album
          imagePullPolicy: Always
          ports:
            - containerPort: 5100
          env:
            - name: DB_HOST_MS_ALBUMES
              valueFrom:
                configMapKeyRef:
                  name: ms-albumes-config
                  key: DB_HOST_MS_ALBUMES
            - name: DB_PORT_MS_ALBUMES
              valueFrom:
                configMapKeyRef:
                  name: ms-albumes-config
                  key: DB_PORT_MS_ALBUMES
            - name: DB_MS_ALBUMES
              valueFrom:
                configMapKeyRef:
                  name: ms-albumes-config
                  key: DB_MS_ALBUMES
            - name: PORT_APP_MS_ALBUMES
              valueFrom:
                configMapKeyRef:
                  name: ms-albumes-config
                  key: PORT_APP_MS_ALBUMES
            - name: DATABASE_MYSQL_USER
              valueFrom:
                secretKeyRef:
                  name: database-secret
                  key: DATABASE_MYSQL_USER
            - name: DATABASE_MYSQL_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: database-secret
                  key: DATABASE_MYSQL_PASSWORD
          resources:
            requests:
              memory: "256Mi"
              cpu: "250m"
            limits:
              memory: "512Mi"
              cpu: "500m"
```

### Artistas

```yml
apiVersion: v1
kind: Service
metadata:
  name: ms-artistas
  namespace: proyecto-sa
spec:
  selector:
    app: ms-artistas
  ports:
    - protocol: TCP
      port: 5200
      targetPort: 5200
  type: ClusterIP
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ms-artistas
  namespace: proyecto-sa
  labels:
    app: ms-artistas
spec:
  selector:
    matchLabels:
      app: ms-artistas
  template:
    metadata:
      labels:
        app: ms-artistas
    spec:
      containers:
        - name: ms-artistas
          image: iskandar1412/pruebas-sa:artista
          imagePullPolicy: Always
          ports:
            - containerPort: 5200
          env:
            - name: PORT_APP_MS_ARTISTA
              valueFrom:
                configMapKeyRef:
                  name: ms-artistas-config
                  key: PORT_APP_MS_ARTISTA
            - name: DATABASE_URL_MS_ARTISTA
              valueFrom:
                configMapKeyRef:
                  name: ms-artistas-config
                  key: DATABASE_URL_MS_ARTISTA
          resources:
            requests:
              memory: "256Mi"
              cpu: "250m"
            limits:
              memory: "512Mi"
              cpu: "500m"
```

### Canciones

```yml
apiVersion: v1
kind: Service
metadata:
  name: ms-canciones
  namespace: proyecto-sa
spec:
  selector:
    app: ms-canciones
  ports:
    - protocol: TCP
      port: 5300
      targetPort: 5300
  type: ClusterIP
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ms-canciones
  namespace: proyecto-sa
  labels:
    app: ms-canciones
spec:
  selector:
    matchLabels:
      app: ms-canciones
  template:
    metadata:
      labels:
        app: ms-canciones
    spec:
      containers:
        - name: ms-canciones
          image: iskandar1412/pruebas-sa:cancion
          imagePullPolicy: Always
          ports:
            - containerPort: 5300
          env:
            - name: PORT_APP_MS_CANCIONES
              valueFrom:
                configMapKeyRef:
                  name: ms-canciones-config
                  key: PORT_APP_MS_CANCIONES
            - name: DATABASE_URL_MS_CANCIONES
              valueFrom:
                configMapKeyRef:
                  name: ms-canciones-config
                  key: DATABASE_URL_MS_CANCIONES
          resources:
            requests:
              memory: "256Mi"
              cpu: "250m"
            limits:
              memory: "512Mi"
              cpu: "500m"
```

###  Reproducciones

```yml
apiVersion: v1
kind: Service
metadata:
  name: ms-reproducciones
  namespace: proyecto-sa
spec:
  selector:
    app: ms-reproducciones
  ports:
    - protocol: TCP
      port: 5400
      targetPort: 5400
  type: ClusterIP
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ms-reproducciones
  namespace: proyecto-sa
  labels:
    app: ms-reproducciones
spec:
  selector:
    matchLabels:
      app: ms-reproducciones
  template:
    metadata:
      labels:
        app: ms-reproducciones
    spec:
      containers:
        - name: ms-albumes
          image: iskandar1412/pruebas-sa:reproduccion
          imagePullPolicy: Always
          ports:
            - containerPort: 5400
          env:
            - name: DB_HOST_MS_REPRODUCCION
              valueFrom:
                configMapKeyRef:
                  name: ms-reproducciones-config
                  key: DB_HOST_MS_REPRODUCCION
            - name: DB_PORT_MS_REPRODUCCION
              valueFrom:
                configMapKeyRef:
                  name: ms-reproducciones-config
                  key: DB_PORT_MS_REPRODUCCION
            - name: DB_MS_REPRODUCCION
              valueFrom:
                configMapKeyRef:
                  name: ms-reproducciones-config
                  key: DB_MS_REPRODUCCION
            - name: PORT_APP_MS_REPRODUCCION
              valueFrom:
                configMapKeyRef:
                  name: ms-reproducciones-config
                  key: PORT_APP_MS_REPRODUCCION
            - name: DATABASE_MYSQL_USER
              valueFrom:
                secretKeyRef:
                  name: database-secret
                  key: DATABASE_MYSQL_USER
            - name: DATABASE_MYSQL_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: database-secret
                  key: DATABASE_MYSQL_PASSWORD
          resources:
            requests:
              memory: "256Mi"
              cpu: "250m"
            limits:
              memory: "512Mi"
              cpu: "500m"
```

### Ingress

```yml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ms-ingress
  namespace: proyecto-sa
  labels:
    app: proyecto-sa
  annotations:
    # kubernetes.io/ingress.global-static-ip-name: "sa-proyecto-ipc-ingress-production"
    # nginx.ingress.kubernetes.io/rewrite-target: "/" 
    nginx.ingress.kubernetes.io/rewrite-target: /$2
    nginx.ingress.kubernetes.io/use-regex: "true"
spec:
  rules:
    - http:
        paths:
          - path: /api/album(/|$)(.*)
          # - path: /api/album
            pathType: ImplementationSpecific
            # pathType: Prefix
            backend:
              service:
                name: ms-albumes
                port: 
                  number: 5100
          - path: /api/artista(/|$)(.*)
          # - path: /api/artista
            pathType: ImplementationSpecific
            # pathType: Prefix
            backend:
              service:
                name: ms-artistas
                port: 
                  number: 5200
          - path: /api/cancion(/|$)(.*)
          # - path: /api/cancion
            pathType: ImplementationSpecific
            # pathType: Prefix
            backend:
              service:
                name: ms-canciones
                port: 
                  number: 5300
          - path: /api/reproduccion(/|$)(.*)
          # - path: /api/reproduccion
            pathType: ImplementationSpecific
            # pathType: Prefix
            backend:
              service:
                name: ms-reproducciones
                port: 
                  number: 5400
```

## Diagrama de Arquitectura

![](./Arqui/DiagramaArquitectura.png)

## Link Postman

```
https://app.getpostman.com/join-team?invite_code=8277a8225b1b6b7aae2b2d976084# D7cc43962680068219ffdbb01d32a0b86a6d1&target_code=bc7b5e60cd4406ecca17a37d76092800
```

## Responder lo Siguiente

### Qué es Kubernetes

Es una plataforma de código abierto para orquestar contenedores. Automatiza despliegues, escalado y gestión de aplicaciones, manejando alta disponibilidad, balanceo de carga y recuperación ante fallos.

### Describir cómo funciona un deploy en kubernetes y sus partes

Se aplica un archivo YAML con el estado deseado. Kubernetes ajusta el clúster para cumplirlo.

* Deployment: Gestiona réplicas y actualizaciones.</br>
* Pod: Unidad mínima con uno o más contenedores.</br>
* Container: Contiene la aplicación (ej. Docker).</br>
* ReplicaSet: Mantiene el número correcto de pods.</br>
* Service: Expone pods (balanceador de carga).</br>
* ConfigMap/Secret: Configuración externa y datos sensibles.</br>

### Qué es deployment

Recurso que asegura el número deseado de réplicas, permite actualizaciones sin caídas (rolling updates) y reversiones (rollback).

### Que es un service

Expone pods de forma estable, actuando como balanceador de carga.

Tipos:

* ClusterIP: Acceso interno.</br>
* NodePort: Expone un puerto en cada nodo.</br>
* LoadBalancer: Usa balanceador externo (nube).</br>

### Que es un cronjob

Ejecuta tareas programadas de manera automática, se puede usar para backups, limpieza de logs, sincronización de datos.