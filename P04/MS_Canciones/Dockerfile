FROM node:23-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
# COPY .env .env

EXPOSE 5300

RUN npx prisma generate

CMD [ "npm", "run", "dev" ]

# docker build -t ms-canciones:v1 .