FROM golang:1.24.1-alpine

WORKDIR /app

COPY . .
# COPY .env .env

RUN go mod tidy
RUN go build -o server .

EXPOSE 5100

CMD [ "./server" ]

# docker build -t ms-albumes:v1 .
# sudo docker tag ms-albumes:v1 iskandar1412/pruebas-sa:album
# sudo docker push iskandar1412/pruebas-sa:album