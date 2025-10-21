FROM node:22.20.0-alpine

WORKDIR /home/node/app

RUN apk add --no-cache curl

ADD ./ /home/node/app
RUN npm install

EXPOSE 80

CMD [ "npm", "run", "start" ]
