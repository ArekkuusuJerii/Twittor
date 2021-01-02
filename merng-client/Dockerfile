# Frontend
FROM node:alpine

WORKDIR /

COPY package*.json /

RUN npm install --production

COPY ./ /

CMD ["npm", "start"]