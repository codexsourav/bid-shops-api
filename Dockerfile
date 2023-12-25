FROM node:18-alpine

RUN npm install -g npm@10.2.5

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 8000

CMD ["npm", "start"]