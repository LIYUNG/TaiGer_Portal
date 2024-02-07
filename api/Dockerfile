FROM node:18-alpine

WORKDIR /app
COPY . .
RUN npm install --production 

USER node
CMD [ "npm", "start" ]