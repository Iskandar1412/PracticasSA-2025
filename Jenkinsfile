// pipeline {
//     agent any
//     environment {
//         PROJECT_ID = 'fresh-shell-455003-s1'
//         ARTIFACT_REGISTRY = 'us-central1-docker.pkg.dev'
//         DOCKER_HUB_REPO = 'iskandar1412/pruebas-sa'
//         IMAGE_TAG = "${BUILD_NUMBER}"
//         KUBE_CONFIG_PATH = '/ruta/a/tu/kubeconfig'
//         DOCKER_HUB_CREDENTIALS = 'docker-hub-credentials' // ID de las credenciales en Jenkins
//     }
//     stages {
//         stage('Clonar Repositorio') {
//             steps {
//                 git branch: 'main',
//                     credentialsId: 'github-credentials-id',
//                     url: 'https://github.com/iskandar1412/Practicas-SA-B-201906051.git'
//             }
//         }
//         stage('Construir y Etiquetar Imágenes') {
//             steps {
//                 script {
//                     // Construir imagen para Docker Hub
//                     docker.build("${DOCKER_HUB_REPO}:album", "P07/MS_Albumes/.")
                    
//                     docker.build("${DOCKER_HUB_REPO}:artista", "P07/MS_Artista/.")
                    
//                     docker.build("${DOCKER_HUB_REPO}:cancion", "P07/MS_Canciones/.")
                        
//                     docker.build("${DOCKER_HUB_REPO}:reproduccion", "P07/MS_Reproduccion/.")
                    
//                     docker.build("${DOCKER_HUB_REPO}:cronjob", "P07/Cronjob/.")
//                 }
//             }
//         }
//         stage('Autenticación con Docker Hub') {
//             steps {
//                 withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
//                     script {
//                         sh '''
//                             echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin
//                         '''
//                     }
//                 }
//             }
//         }
//         stage('Push a Docker Hub') {
//             steps {
//                 script {
//                     sh '''
//                         docker push iskandar1412/pruebas-sa:album
//                         docker push iskandar1412/pruebas-sa:artista
//                         docker push iskandar1412/pruebas-sa:cancion
//                         docker push iskandar1412/pruebas-sa:reproduccion
//                         docker push iskandar1412/pruebas-sa:cronjob
//                     '''
//                 }
//             }
//         }
//         stage('Autenticación con GCP') {
//             steps {
//                 withCredentials([file(credentialsId: 'bucket-artifact', variable: 'GCP_KEY')]) {
//                     script {
//                         sh '''
//                             export GOOGLE_APPLICATION_CREDENTIALS=$GCP_KEY
//                             gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS
//                             gcloud config set project ${PROJECT_ID}
//                             gcloud auth configure-docker ${ARTIFACT_REGISTRY}
//                         '''
//                     }
//                 }
//             }
//         }
//         stage('Push a Artifact Registry') {
//             steps {
//                 script {
//                     def album = "${DOCKER_HUB_REPO}:album"
//                     def artista = "${DOCKER_HUB_REPO}:artista"
//                     def cancion = "${DOCKER_HUB_REPO}:cancion"
//                     def reproduccion = "${DOCKER_HUB_REPO}:reproduccion"
//                     def cronjob = "${DOCKER_HUB_REPO}:cronjob"
//                     def registryAlbum = "${ARTIFACT_REGISTRY}/${PROJECT_ID}/bucketimages/${DOCKER_HUB_REPO}:album"
//                     def registryArtista = "${ARTIFACT_REGISTRY}/${PROJECT_ID}/bucketimages/${DOCKER_HUB_REPO}:artista"
//                     def registryCancion = "${ARTIFACT_REGISTRY}/${PROJECT_ID}/bucketimages/${DOCKER_HUB_REPO}:cancion"
//                     def registryReproduccion = "${ARTIFACT_REGISTRY}/${PROJECT_ID}/bucketimages/${DOCKER_HUB_REPO}:reproduccion"
//                     def registryCronjob = "${ARTIFACT_REGISTRY}/${PROJECT_ID}/bucketimages/${DOCKER_HUB_REPO}:cronjob"


//                     sh "docker tag ${album} ${registryAlbum}"
//                     sh "docker tag ${artista} ${registryArtista}"
//                     sh "docker tag ${cancion} ${registryCancion}"
//                     sh "docker tag ${reproduccion} ${registryReproduccion}"
//                     sh "docker tag ${cronjob} ${registryCronjob}"

//                     sh "docker push ${registryAlbum}"
//                     sh "docker push ${registryArtista}"
//                     sh "docker push ${registryCancion}"
//                     sh "docker push ${registryReproduccion}"
//                     sh "docker push ${registryCronjob}"
//                 }
//             }
//         }
//         stage('Desplegar en Kubernetes') {
//             steps {
//                 script {
//                     withCredentials([file(credentialsId: 'kubernetes-id', variable: 'KUBECONFIG')]) {

//                         sh """
//                             export KUBECONFIG=$KUBECONFIG

//                             kubectl apply -f P07/K8S/namespaces/namespace-project.yaml
//                             kubectl apply -f P07/K8S/Secrets/secret.yaml
//                             kubectl apply -f P07/K8S/config/configMap.yaml

//                             kubectl delete -f P07/K8S/Deploys/cronjob.yaml --ignore-not-found=true 
//                             kubectl apply -f P07/K8S/Deploys/cronjob.yaml

//                             kubectl delete -f P07/K8S/Deploys/albumes.yaml --ignore-not-found=true 
//                             kubectl apply -f P07/K8S/Deploys/albumes.yaml
                            
//                             kubectl delete -f P07/K8S/Deploys/artistas.yaml --ignore-not-found=true 
//                             kubectl apply -f P07/K8S/Deploys/artistas.yaml
                            
//                             kubectl delete -f P07/K8S/Deploys/canciones.yaml --ignore-not-found=true 
//                             kubectl apply -f P07/K8S/Deploys/canciones.yaml
                            
//                             kubectl delete -f P07/K8S/Deploys/reproducciones.yaml --ignore-not-found=true 
//                             kubectl apply -f P07/K8S/Deploys/reproducciones.yaml
                            
//                             kubectl apply -f P07/K8S/Ingress/ingress.yaml
//                         """
//                     }
//                 }
//             }
//         }
//     }
//     post {
//         always {
//             cleanWs()
//         }
//     }
// }

// en esto deberemos tener node globalmente
/*
sudo su
cd /usr/local/src
sudo curl -O https://nodejs.org/dist/v23.11.0/node-v23.11.0-linux-x64.tar.xz
sudo tar -xf node-v23.11.0-linux-x64.tar.xz
sudo mv node-v23.11.0-linux-x64 /usr/local/nodejs
echo 'export PATH=/usr/local/nodejs/bin:$PATH' | sudo tee /etc/profile.d/nodejs.sh
source /etc/profile.d/nodejs.sh

sudo /usr/local/nodejs/bin/npm install -g pm2
/usr/local/nodejs/bin/pm2 -v
pm2 startup systemd
sudo env PATH=$PATH:/usr/local/bin pm2 startup systemd -u jenkins --hp /var/lib/jenkins

sudo su - jenkins
export PATH=/usr/local/nodejs/bin:$PATH
pm2 save

exit
exit

sudo su // Caso superusuario
sudo su - jenkins // En caso de ir al usuario de jenkins
*/

pipeline {
    agent any
    environment {
        GITHUB_TOKEN = credentials('github-credentials-token')
    }
    stages {
        stage('Deploy Frontend') {
            steps {
                dir('Practicas-SA-B-201906051/P09/Front') {
                    sh '''
                        # Aseguramos que Jenkins vea Node y PM2
                        export PATH=/usr/local/nodejs/bin:/usr/local/bin:$PATH
                        export HOME=/var/lib/jenkins

                        echo "[+] Actualizando código... en P09"
                        git pull https://$GITHUB_TOKEN@github.com/Iskandar1412/Practicas-SA-B-201906051.git main

                        echo "[+] Instalando dependencias..."
                        npm install

                        echo "[+] Deteniendo instancia anterior de frontend (si existe)..."
                        pm2 delete frontend || true

                        echo "[+] Iniciando frontend con PM2..."
                        pm2 start "npm run dev -- --host" --name frontend

                        echo "[+] Guardando configuración de PM2 (opcional, si hiciste pm2 startup)..."
                        pm2 save

                        echo "[+] Estado actual de PM2:"
                        pm2 status
                    '''
                }
            }
        }
    }
}
