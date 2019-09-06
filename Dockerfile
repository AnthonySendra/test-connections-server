FROM node:12.10.0-alpine

WORKDIR /home/node/app

ADD ./ /home/node/app
RUN npm install

EXPOSE 80

CMD [ "npm", "run", "start" ]