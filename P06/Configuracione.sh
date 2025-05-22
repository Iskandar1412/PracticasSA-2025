! --------------------------------------------------
! Instalar Podman
! --------------------------------------------------

paru -S podman

paru -S podman-desktop

podman --version

! --------------------------------------------------
! Instalar KubeCTL
! --------------------------------------------------

sudo pacman -S kubectl
kubectl version --client

! --------------------------------------------------
! Instalar Kind
! --------------------------------------------------

paru -S kind-bin

kind --version

systemctl --user enable podman.socket
systemctl --user start podman.socket

ls /sys/fs/cgroup
stat -fc %T /sys/fs/group

! --------------------------------------------------
! Configuar container.conf (en caso que no exista)
! --------------------------------------------------

nvim ~/.config/containers/container.conf

! --------------------------------------------------

[engine]
cgroup_manager = "systemd"

! --------------------------------------------------

export KIND_EXPERIMENTAL_PROVIDER=podman
export CGROUP_DRIVER=systemd

sudo loginctl enable-linger $user

! --------------------------------------------------
! Creación/Eliminación Cluster
! --------------------------------------------------

kind create cluster --name <nombre>
kind create cluster --name prueba
kind delete cluster --name <nombre>
kind delete cluster --name prueba

! Verificar

podman ps
podman pa -a

kubectl get nodes


! Para cada Microservicio (En caso de ser local para cargar imagenes en pods)

docker save ms-albumes:v1 -o ms-albumes.tar
docker save ms-artistas:v1 -o ms-artistas.tar
docker save ms-canciones:v1 -o ms-canciones.tar
docker save ms-reproducciones:v1 -o ms-reproducciones.tar

! Importar imágenes a cluster de kind (podman)

podman cp ms-albumes.tar prueba-control-plane:/ms-albumes.tar
podman cp ms-artistas.tar prueba-control-plane:/ms-artistas.tar
podman cp ms-canciones.tar prueba-control-plane:/ms-canciones.tar
podman cp ms-reproducciones.tar prueba-control-plane:/ms-reproducciones.tar

podman exec -it prueba-control-plane bash

ctr -n=k8s.io images import /ms-albumes.tar
ctr -n=k8s.io images import /ms-artistas.tar
ctr -n=k8s.io images import /ms-canciones.tar
ctr -n=k8s.io images import /ms-reproducciones.tar

! Ver errores de pods

kubectl logs ms-albumes-ccd69ff55-p5kcq

! En caso que usemos db de Docker y esto de podman local con kind

ip a | grep inet



!kind load image-archive ms-albumes.tar --name prueba-control-plane
!kind load image-archive ms-reproducciones.tar --name prueba-control-plane
!kind load image-archive ms-canciones.tar --name prueba-control-plane
!kind load image-archive ms-artistas.tar --name prueba-control-plane


! pausar cluster

podman stop prueba-control-plane


! iniciar cluster

podman start prueba-control-plane

! --------------------------------------------------
! Creación/Eliminación Cluster
! --------------------------------------------------

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.9.4/deploy/static/provider/kind/deploy.yaml

