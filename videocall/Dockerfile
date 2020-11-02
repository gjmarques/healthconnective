FROM node:lts

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8008:8008

CMD [ "npm", "run-script", "run" ]