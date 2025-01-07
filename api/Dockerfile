# FROM node:18-alpine

# Test aws ecr
FROM public.ecr.aws/amazonlinux/amazonlinux:2.0.20241217.0-arm64v8

# Install Node.js 18.x and npm for amazon linux
RUN yum install -y nodejs

WORKDIR /app
COPY . .
RUN npm install --production 

USER node
CMD [ "npm", "start" ]