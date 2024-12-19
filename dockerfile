# Etapa 1: Instalar as dependências
FROM node:18 AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

# Etapa 2: Compilar o TypeScript
COPY . .
RUN npm run build 

# Etapa 3: Rodar a aplicação
CMD ["node", "dist/server.js"]
