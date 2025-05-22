FROM golang:1.24-alpine

WORKDIR /app

COPY . .
# COPY .env .env

RUN go mod tidy
RUN go build -o server .

EXPOSE 5400

CMD [ "./server" ]

# docker build -t ms-reproducciones:v1 .