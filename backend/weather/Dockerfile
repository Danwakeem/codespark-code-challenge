FROM node:16-alpine

WORKDIR /usr/src/app
COPY package*.json ./

ENV TZ=UTC

RUN npm ci --only=production

COPY . .

EXPOSE 4000
CMD [ "npm", "start" ]