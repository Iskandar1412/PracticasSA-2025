# Documentación

## Contratos de Microservicios

* https://app.getpostman.com/join-team?invite_code=46126d76201eb02420cca91c1ac82e3f68195d723fa1302fc55e240ad8e35cff&target_code=facc1474a256df55394adfa32a6e5b17

## Dockerfile Microservicios

* Albumes

```Dockerfile
FROM golang:1.24.1

WORKDIR /app

COPY . .
# COPY .env .env

RUN go mod tidy
RUN go build -o server .

EXPOSE 5100

CMD [ "./server" ]
```

* Artistas

```Dockerfile
FROM node:23.9.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
# COPY .env .env

EXPOSE 5200

RUN npx prisma generate

CMD [ "npm", "run", "dev" ]
```

* Canciones

```Dockerfile
FROM node:23.9.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
# COPY .env .env

EXPOSE 5300

RUN npx prisma generate

CMD [ "npm", "run", "dev" ]
```

* Reproducciones

```Dockerfile
FROM golang:1.24.1

WORKDIR /app

COPY . .
# COPY .env .env

RUN go mod tidy
RUN go build -o server .

EXPOSE 5400

CMD [ "./server" ]
```

## Docker Compose

```yml
services:
  microservice_albumes:
    build: ./MS_Albumes
    container_name: 'microservice_albumes'
    environment:
      DB_HOST_MS_ALBUMES: "0.0.0.0"
      DB_PORT_MS_ALBUMES: 3306
      DB_USER_MS_ALBUMES: root
      DB_PASSWORD_MS_ALBUMES: iskandar
      DB_MS_ALBUMES: MS_PR4_Album
      PORT_APP_MS_ALBUMES: 5100
    ports:
      - "5100:5100"
    depends_on:
      - mysql
    networks:
      - app-network
      
  microservice_artistas:
    build: ./MS_Artista
    container_name: 'microservice_artistas'
    environment:
      DB_HOST_MS_ARTISTA: sa
      DB_PORT_MS_ARTISTA: 3306
      DB_USER_MS_ARTISTA: root
      DB_PASSWORD_MS_ARTISTA: iskandar
      DB_MS_ARTISTA: MS_PR4_Artista
      PORT_APP_MS_ARTISTA: 5200
      DATABASE_URL_MS_ARTISTA: "mysql://root:iskandar@localhost:3306/MS_PR4_Artista"
    ports:
      - "5200:5200"
    depends_on:
      - mysql
    networks:
      - app-network

  microservice_canciones:
    build: ./MS_Canciones
    container_name: 'microservice_canciones'
    environment:
      DB_HOST_MS_CANCIONES: sa
      DB_PORT_MS_CANCIONES: 3306
      DB_USER_MS_CANCIONES: root
      DB_PASSWORD_MS_CANCIONES: iskandar
      DB_MS_CANCIONES: MS_PR4_Cancion
      PORT_APP_MS_CANCIONES: 5300
      DATABASE_URL_MS_CANCIONES: "mysql://root:iskandar@0.0.0.0:3306/MS_PR4_Cancion"
    ports:
      - "5300:5300"
    depends_on:
      - mysql
    networks:
      - app-network

  microservice_reproduccion:
    build: ./MS_Reproduccion
    container_name: 'microservice_reproduccion'
    environment:
      DB_HOST_MS_REPRODUCCION: "0.0.0.0"
      DB_PORT_MS_REPRODUCCION: 3306
      DB_USER_MS_REPRODUCCION: root
      DB_PASSWORD_MS_REPRODUCCION: iskandar
      DB_MS_REPRODUCCION: MS_PR4_Album
      PORT_APP_MS_REPRODUCCION: 5400
    ports:
      - "5400:5400"
    depends_on:
      - mysql
    networks:
      - app-network
  mysql:
    image: mysql:latest
    container_name: sa
    environment:
      MYSQL_ROOT_PASSWORD: iskandar
    ports:
      - "3306:3306"
    networks:
      - app-network
    volumes:
      - ./init-db.d:/docker-entrypoint-initdb.d
      
networks:
  app-network:
    driver: bridge
```

## Diagrama de Arquitectura

![](./Arqui/DiagramaArquitectura.png)

## Diagrama ER

* Album

![](./db/MS_PR4_Album.png)

* Artista

![](./db/MS_PR4_Artista.png)

* Cancion

![](./db/MS_PR4_Cancion.png)

* Reproduccion

![](./db/MS_PR4_Reproduccion.png)


## GraphQL

GraphQL es un lenguaje de consulta para APIs para ejecutar esas consultas en los datos existentes. Fue desarrollado por Facebook en 2012 y lanzado como proyecto de código abierto en 2015.

### Características

* Consulta flexible: Permite obtener solo los datos requeridos en una sola petición.</br>
* Tipos fuertemente tipados: Usa un esquema definido con tipos de datos.</br>
* Consulta en una sola llamada: Reduce el número de peticiones necesarias en comparación con REST.</br>
* Jerarquía de datos: Se estructura de manera similar a la representación en la base de datos o en objetos del backend.

### Instalación 

```sh
npm install @apollo/server graphql
```
o

```sh
npm install express graphql express-graphql
```

### Definición Esquema

```
type Usuario {
  id: ID!
  nombre: String!
  email: String!
}

type Query {
  obtenerUsuario(id: ID!): Usuario
  listarUsuarios: [Usuario]
}

type Mutation {
  crearUsuario(nombre: String!, email: String!): Usuario
}
```


### Implementando con Apollo

```js
const { ApolloServer, gql } = require('apollo-server');

// Definir el esquema
const typeDefs = gql`
  type Usuario {
    id: ID!
    nombre: String!
    email: String!
  }

  type Query {
    obtenerUsuario(id: ID!): Usuario
    listarUsuarios: [Usuario]
  }

  type Mutation {
    crearUsuario(nombre: String!, email: String!): Usuario
  }
`;


let usuarios = [
  { id: "1", nombre: "Juan", email: "juan@example.com" },
  { id: "2", nombre: "Ana", email: "ana@example.com" }
];

// Definir los resolvers
const resolvers = {
  Query: {
    obtenerUsuario: (_, { id }) => usuarios.find(user => user.id === id),
    listarUsuarios: () => usuarios,
  },
  Mutation: {
    crearUsuario: (_, { nombre, email }) => {
      const nuevoUsuario = { id: String(usuarios.length + 1), nombre, email };
      usuarios.push(nuevoUsuario);
      return nuevoUsuario;
    }
  }
};


const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Servidor corriendo en ${url}`);
});
```


### Consultas

* Obtener Usuario por ID

```
query {
  obtenerUsuario(id: "1") {
    nombre
    email
  }
}
```

* Listar usuarios

```
query {
  listarUsuarios {
    id
    nombre
    email
  }
}
```

* Creación de usuario (mutación)

```
mutation {
  crearUsuario(nombre: "Carlos", email: "carlos@example.com") {
    id
    nombre
    email
  }
}
```

* Revisar networks internas de docker

#  docker network ls  

* Conectar la db en este caso a la network de p04 que sería para la practica

#  docker network connect p04_default sa

* Revisar si todos están en el mismo network 

#  docker network inspect p04_default
#  si están todos en el mismo usarán sa