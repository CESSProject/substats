FROM node:16-alpine3.15

WORKDIR /substats
COPY . .

RUN npm install
