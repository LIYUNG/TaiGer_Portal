# FROM node:18-alpine

# Test aws ecr
FROM node:18

# Install Node.js 18.x and npm for amazon linux
RUN yum install -y nodejs

WORKDIR /app
COPY . .
RUN npm install --production 

USER node
CMD [ "npm", "start" ]