# Instrucciones GCLOUD

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
  account: diarmuidua139@gmail.com
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
 [1] diarmuidua139@gmail.com
 [2] Sign in with a new Google Account
 [3] Skip this step
Please enter your numeric choice:  1

You are signed in as: [diarmuidua139@gmail.com].

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

* Commands that require authentication will use diarmuidua139@gmail.com by default
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

