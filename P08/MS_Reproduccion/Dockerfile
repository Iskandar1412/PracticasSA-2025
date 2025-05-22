FROM golang:1.24.1-alpine

WORKDIR /app

COPY . .
# COPY .env .env

RUN go mod tidy
RUN go build -o server .

EXPOSE 5400

CMD [ "./server" ]

# docker build -t ms-reproducciones:v1 .
# sudo docker tag ms-reproducciones:v1 iskandar1412/pruebas-sa:reproduccion
# sudo docker push iskandar1412/pruebas-sa:reproduccion