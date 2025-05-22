FROM node:23-slim

WORKDIR /app

RUN apt-get update && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install

COPY . .
# COPY .env .env

EXPOSE 5200

RUN npx prisma generate

CMD [ "npm", "run", "dev" ]

# docker build -t ms-artistas:v1 .
# sudo docker tag ms-artistas:v1 iskandar1412/pruebas-sa:artista
# sudo docker push iskandar1412/pruebas-sa:artista