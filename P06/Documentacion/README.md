# Documentación

## Comandos utilizados

### Instalación KubeCTL

```sh
sudo pacman -S kubectl
kubectl version --client
```

## Instalación GCLOUD

> De preferencia no usar `paru -S google-cloud-sdk` (porque sino se vuelve un kilombo)

```sh
curl -O https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-cli-517.0.0-linux-x86_64.tar.gz

tar -xf google-cloud-cli-517.0.0-linux-x86_64.tar.gz

./google-cloud-sdk/install.sh
```

- Reiniciar terminal

```sh
gcloud components update

gcloud components install gke-gcloud-auth-plugin kubectl
```


## Inicio sesión GCLOUD


```sh
# iniciamos sesion la id del proyecto ya existe por default así que se escoge la primera opción)
gcloud init
```

> Consola

```sh
❯ gcloud init
Welcome! This command will take you through the configuration of gcloud.

Settings from your current configuration [default] are:
core:
  account: XXX@gmail.com
  disable_usage_reporting: 'True'

Pick configuration to use:
 [1] Re-initialize this configuration [default] with new settings 
 [2] Create a new configuration
Please enter your numeric choice:  1

Your current configuration has been set to: [default]

You can skip diagnostics next time by using the following flag:
  gcloud init --skip-diagnostics

Network diagnostic detects and fixes local network connection issues.
Checking network connection...done.                                           
Reachability Check passed.
Network diagnostic passed (1/1 checks passed).

Choose the account you want to use for this configuration.
To use a federated user account, exit this command and sign in to the gcloud 
CLI with your login configuration file, then run this command again.

Select an account:
 [1] XXX@gmail.com
 [2] Sign in with a new Google Account
 [3] Skip this step
Please enter your numeric choice:  1

You are signed in as: [XXX@gmail.com].

Pick cloud project to use: 
 [1] fresh-shell-455003-s1
 [2] Enter a project ID
 [3] Create a new project
Please enter numeric choice or text value (must exactly match list item):  1

Your current project has been set to: [fresh-shell-455003-s1].

Do you want to configure a default Compute Region and Zone? (Y/n)?  y

Which Google Compute Engine zone would you like to use as project default?
If you do not specify a zone via a command line flag while working with Compute
 Engine resources, the default is assumed.
 [1] us-east1-b
 [2] us-east1-c
 [3] us-east1-d
 [4] us-east4-c
 [5] us-east4-b
 [6] us-east4-a
 ....
Did not print [78] options.
Too many options [128]. Enter "list" at prompt to print choices fully.
Please enter numeric choice or text value (must exactly match list item):  2

Your project default Compute Engine zone has been set to [us-east1-c].
You can change it by running [gcloud config set compute/zone NAME].

Your project default Compute Engine region has been set to [us-east1].
You can change it by running [gcloud config set compute/region NAME].

Created a default .boto configuration file at [/home/iskandar/.boto]. See this file and
[https://cloud.google.com/storage/docs/gsutil/commands/config] for more
information about configuring Google Cloud Storage.
The Google Cloud CLI is configured and ready to use!

* Commands that require authentication will use XXX@gmail.com by default
* Commands will reference project `fresh-shell-455003-s1` by default
* Compute Engine commands will use region `us-east1` by default
* Compute Engine commands will use zone `us-east1-c` by default

Run `gcloud help config` to learn how to change individual settings

This gcloud configuration is called [default]. You can create additional configurations if you work with multiple accounts and/or projects.
Run `gcloud topic configurations` to learn more.

Some things to try next:

* Run `gcloud --help` to see the Cloud Platform services you can interact with. And run `gcloud help COMMAND` to get help on any gcloud command.
* Run `gcloud topic --help` to learn about advanced features of the CLI like arg files and output formatting
* Run `gcloud cheat-sheet` to see a roster of go-to `gcloud` commands.
```

- Describir detalles del proyecto

```sh
❯ gcloud projects describe fresh-shell-455003-s1
createTime: '2025-03-27T03:41:53.261823Z'
lifecycleState: ACTIVE
name: My First Project
projectId: fresh-shell-455003-s1
projectNumber: '1001154985248'
```

- Cambiar region

```sh
# Para GKE, us-central1 suele ser mejor
gcloud config set compute/region us-central1
gcloud config set compute/zone us-central1-c
```

- Habilitar Servicios escenciales

```sh
gcloud services enable \
  container.googleapis.com \
  compute.googleapis.com \
  iam.googleapis.com
```

- Creamos subnet (por el momento no)

```sh
# Crear VPC
gcloud compute networks create vpc-sa --subnet-mode=custom

# Crear subred
gcloud compute networks subnets create subred-sa \
  --network=vpc-sa \
  --region=us-central1 \
  --range=10.0.0.0/16

# Crear reglas de firewall
gcloud compute firewall-rules create firewall-sa \
  --network=vpc-sa \
  --direction=INGRESS \
  --action=ALLOW \
  --rules=tcp:80,tcp:443 \
  --source-ranges=0.0.0.0/0
```

- Creamos Cluster

```sh
# Cluster con vcp y firewall default
gcloud container clusters create software-avanzado \
  --num-nodes=2 \
  --machine-type=e2-small \
  --region=us-central1 \
  --enable-ip-alias \
  --disk-size=50GB

# Cluster ya con los vpc y firewall
gcloud container clusters create software-avanzado \
  --num-nodes=2 \
  --machine-type=e2-small \
  --region=us-central1 \
  --enable-ip-alias \
  --network=vpc-sa \
  --subnetwork=subred-sa \
  --disk-size=50GB
```

- Configrar acceso con kubectl 

```sh
# Conectar cluster
gcloud container clusters get-credentials software-avanzado \
  --region us-central1 \
  --project fresh-shell-455003-s1

# Verificar conexión
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

kubectl apply -f ./Ingress/ingress.yaml
```

### Ingress

```shell
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.9.4/deploy/static/provider/cloud/deploy.yaml

kubectl get svc -n ingress-nginx
kubectl get nodes

kubectl label nodes gke-practicas-sa-default-pool-3d0e6934-whb8 ingress-ready=true # NO ES NECESARIO

kubectl port-forward -n ingress-nginx svc/ingress-nginx-controller 8080:80

# En caso de querer borrar un cluster local o que ya no uses
## kubectl confit delete-cluster <nombre-cluster>
kubectl config delete-cluster gke_fresh-shell-455003-s1_us-central1_practicas-sa

# en caso de no saber comom se llama
cat ~/.kube/config
```

## Archivos Despliegues Kubernetes

## namespace

```yml
apiVersion: v1
kind: Namespace
metadata:
  name: proyecto-sa
```

### ConfigMap

```yml
apiVersion: v1
kind: ConfigMap
metadata:
  name: ms-albumes-config
  namespace: proyecto-sa
data:
  DB_HOST_MS_ALBUMES: "proyecto-sa.XXXXXX.us-east-1.rds.amazonaws.com"
  DB_PORT_MS_ALBUMES: "3306"
  DB_MS_ALBUMES: "MS_PR4_Album"
  PORT_APP_MS_ALBUMES: "5100"
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: ms-artistas-config
  namespace: proyecto-sa
data:
  PORT_APP_MS_ARTISTA: "5200"
  DATABASE_URL_MS_ARTISTA: "mysql://admingrupo11:XXXXXX@proyecto-sa.XXXXXX.us-east-1.rds.amazonaws.com:3306/MS_PR4_Artista"
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: ms-canciones-config
  namespace: proyecto-sa
data:
  PORT_APP_MS_CANCIONES: "5300"
  DATABASE_URL_MS_CANCIONES: "mysql://admingrupo11:XXXXXX@proyecto-sa.XXXXXX.us-east-1.rds.amazonaws.com:3306/MS_PR4_Cancion"
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: ms-reproducciones-config
  namespace: proyecto-sa
data:
  DB_HOST_MS_REPRODUCCION: "proyecto-sa.XXXXXX.us-east-1.rds.amazonaws.com"
  DB_PORT_MS_REPRODUCCION: "3306"
  DB_MS_REPRODUCCION: "MS_PR4_Reproduccion"
  PORT_APP_MS_REPRODUCCION: "5400"
```

### Secrets

```yml
apiVersion: v1
kind: Secret
metadata:
  name: database-secret
  namespace: proyecto-sa
type: Opaque
data:
  DATABASE_MYSQL_USER: YWRtaW5ncnVwbzEx # root
  DATABASE_MYSQL_PASSWORD: XXXXXX= # iskandar
```


### Albumes

```yml
apiVersion: v1
kind: Service
metadata:
  name: ms-albumes
  namespace: proyecto-sa
  annotations:
    cloud.google.com/neg: '{"ingress": true}'
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
              memory: "128Mi"
              cpu: "125m"
            limits:
              memory: "128Mi"
              cpu: "125m"
```

### Artistas

```yml
apiVersion: v1
kind: Service
metadata:
  name: ms-artistas
  namespace: proyecto-sa
  annotations:
    cloud.google.com/neg: '{"ingress": true}'
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
              cpu: "125m"
            limits:
              memory: "256Mi"
              cpu: "125m"
```

### Canciones

```yml
apiVersion: v1
kind: Service
metadata:
  name: ms-canciones
  namespace: proyecto-sa
  annotations:
    cloud.google.com/neg: '{"ingress": true}'
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
              cpu: "125m"
            limits:
              memory: "256Mi"
              cpu: "125m"
```

###  Reproducciones

```yml
apiVersion: v1
kind: Service
metadata:
  name: ms-reproducciones
  namespace: proyecto-sa
  annotations:
    cloud.google.com/neg: '{"ingress": true}'
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
              memory: "128Mi"
              cpu: "125m"
            limits:
              memory: "128Mi"
              cpu: "125m"
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
    nginx.ingress.kubernetes.io/rewrite-target: /$2
    nginx.ingress.kubernetes.io/use-regex: "true"
spec:
  ingressClassName: nginx
  rules:
    - http:
        paths:
          - path: /api/album(/|$)(.*)
            pathType: ImplementationSpecific
            backend:
              service:
                name: ms-albumes
                port:
                  number: 5100
          - path: /api/artista(/|$)(.*)
            pathType: ImplementationSpecific
            backend:
              service:
                name: ms-artistas
                port:
                  number: 5200
          - path: /api/cancion(/|$)(.*)
            pathType: ImplementationSpecific
            backend:
              service:
                name: ms-canciones
                port:
                  number: 5300
          - path: /api/reproduccion(/|$)(.*)
            pathType: ImplementationSpecific
            backend:
              service:
                name: ms-reproducciones
                port:
                  number: 5400

```

## Diagrama de Arquitectura (Antiguo)

![](./Arqui/DiagramaArquitectura.png)

## Nuevo Diagrama de Arquitectura

![](./Arqui/NuevoDiagrama.png)


## Link Postman

```
[https://app.getpostman.com/join-team?invite_code=8277a8225b1b6b7aae2b2d976084# D7cc43962680068219ffdbb01d32a0b86a6d1&target_code=bc7b5e60cd4406ecca17a37d76092800](https://app.getpostman.com/join-team?invite_code=8277a8225b1b6b7aae2b2d9760847cc43962680068219ffdbb01d32a0b86a6d1&target_code=970c88aa28d2c5419ce34fdeb1eafca1)
```

## Responder lo Siguiente

### Una descripción de su plataforma de nube seleccionada y justificar la selección de la misma.

Con respecto a la plataforma de la nube utilizada (En este caso GCP con lo que es Google Kubernetes Engine <GKE>), la razón por la que fue elegida fue más que todo por descarte, AWS tiene una curva de aprendizaje mucho más extenso de lo que lleva GKE.
</br>
</br>
La plataforma en sí como se mira en el diagrama cuenta con lo que es su servicio de Base de datos externos (AWS -> RDS) prácticamente si llevo algo de tiempo, pero con un poco de busqueda de documentación se logró la conexión de la base de datos y las aplicaciones.</br>
Con respecto a lo que es cada servicio, se tomo en cuenta que cada uno tendría uno los artistas, otro las canciones, otro contendría los álbumes de los artistas, y el último tendría lo que es la playlist que usarían los usuarios para agregar músicas para escuchar.

### Listar y describir todos los servicios utilizados en su solución.

Creo que no es necesario ya que el nombre dicta mucho de que tratan, pero weno.... no entiendo la razon pero como dicen **"it is what it is"**:

* **Servicio de Albumes:** Se encarga de tener la información de los albumes que tienen los artistas, fechas, etc.
* **Servicio de Artistas:** Este va a contener la información de los artistas (cantantes).
* **Servicio de Canciones:** Va a obtener valga la redundancia la información de las canciones de los artistas.
* **Servicio de Reproducciones:** Este es una lista de reproducción para los usuarios, que hagan sus listas con lo que son las canciones de los artistas para escucharlas.

### Listar y describir los comandos de kubernetes utilizados.

Como este tambien no le veo mucho, le comprendo más la razon de describir comandos, pero weno... siento que si se utilizaron fue por una razon (más si se trata de arch linux que fue todo un kilombo el hacer que agarrase post desinstalar la basura que dio el sistema de paquetería de Paru e instalar todo manualmente).

---

```sh
gcloud components update

gcloud components install gke-gcloud-auth-plugin kubectl
```

Tenemos los dos primeros, estos son la base para todo lo que será el buen funcionamiento de las utilidades de google cloud.
* El primero es para actualizar los componentes (en caso que no lo estén, porque generalmente si se requieren tenerlos actualizados constantemente).</br>
* El segundo es la instalación de los componentes de kubectl para hacer los deploys... prácticamente para hacer las configuraciones de los pods y todos los servicios, namespaces, ingress, etc, lo de `gke-gcloud-auth-plugin` sirve para el uso correcto autenticar casi que, guardar credenciales, todo lo que tiene que ver con la sesión del usuario.

---

```sh
gcloud init
```

Este comando creo que es obvio para que sirve, pero en pocas palabras, sirve o va a servir para vincular el ordenador gcloud del ordenador con la cuenta de gcp que se tiene, obviamente no se podrán hacer clusters si no se tiene la seción iniciada.

--- 

```sh
gcloud services enable \
  container.googleapis.com \
  compute.googleapis.com \
  iam.googleapis.com
```

No se si para otros fue así, pero para mi caso que abrí una cuenta de 0, tuve que habilitar los servicios para utilizar, entre eso los componentes de contenedores, el de usuarios (iam <y vaya que me recuerda esto a lo de AWS>).

--- 

```sh
gcloud container clusters create software-avanzado \
  --num-nodes=2 \
  --machine-type=e2-small \
  --region=us-central1 \
  --enable-ip-alias \
  --disk-size=50GB
```

Este es para crear nuestro cluster en la nube, ahí se especifica el tipo de máquina a usar (ojito en ello porque como somos cuenta gratuita valemos queso en el tiempo de máquina a usar), el número de nodos, la region a la que va a pertenecer, y lo que es el tamaño de disco (memoria).
</br>

Un tip para todo ello, si no te quieres quedar pobre, mejor dejar el cluster cuando realmente se vaya a usar, y tratar que sea lo más liviano, porque sino `chipilin`, se vale tres hectáreas de queso.

---

```sh
gcloud container clusters get-credentials software-avanzado \
  --region us-central1 \
  --project fresh-shell-455003-s1
```

.... Bueno... aqui lo que hacemos es obtener las credenciales del cluster para ya trabajarlo localmente (mejor si se tiene Lens porque de esa forma ves más gráficamente que tan bien o mal estan los pods que se crean <y esto va a lo que son recursos de los núcleos>)

---

```sh
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.9.4/deploy/static/provider/cloud/deploy.yaml
```

Realmente no queria hablar de esta cosa del diablo, que bien que me llevo buen tiempo hacer que funcionara, pero bueno... a lo que vamos.</br>
Sirve para instalar nuestro ingress o lo que vamos a utilizar excluyendo el ingress nativo que trae el propio cluster (Viva!!!! perdí mucho tiempo para darme cuenta que tenía uno propio el cluster, pero bueno... la cosa es que funciona). Este servirá para prácticamente hacer que lleguen las peticiones o hará como intermediario para lo que son los microservicios, pero... como todo en la vida de un sistemas, debe ser configurado.

---

Ahora si vamos a lo hermoso de esta cosa

```sh
kubectl apply -f ./namespaces/namespace-project.yaml

kubectl apply -f ./config/configMap.yaml

kubectl apply -f ./Secrets/secret.yaml

kubectl apply -f ./Deploys/albumes.yaml

kubectl apply -f ./Deploys/artistas.yaml

kubectl apply -f ./Deploys/canciones.yaml

kubectl apply -f ./Deploys/reproducciones.yaml

kubectl apply -f ./Ingress/ingress.yaml
```

Estos son para aplicar configuraciones, si bien no aparecen los <services> pues bien... si estan pero en los deploys, y ¿por qué así lo hice?, la respuesta a ello es porque tenia demasiada flojera de estar quita y pone, quita y pone por separado todo.</br>
De ahí tenemos los Secrets que son de la base de datos, el configMap que son para lo que son variables de entorno, y el Ingress, que es... pues... el ingress.
</br>
</br>
</br>

Y eso sería todo por parte de los comandos... sé que hay más pero puse los que más utilicé para esta barbaridad, ya que problema tras problema sucedia, primero lo de "nodos insuficientes" luego del méndigo ingress que no queria agarrar y por último... pues... creo que nada, ahí quedaría.