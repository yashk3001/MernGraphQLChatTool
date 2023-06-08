FROM node:16

WORKDIR /app

COPY package.json ./

COPY .env ./

COPY . .

RUN yarn

EXPOSE 4000

CMD [ "node", "index.js" ]