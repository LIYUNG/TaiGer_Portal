# FROM node:18-alpine

# Test aws ecr
FROM public.ecr.aws/docker/library/node:18.20.5-alpine

# Update package list and install necessary tools
RUN apk add --no-cache bash curl

WORKDIR /app
COPY . .
RUN npm install --production 

USER node
CMD [ "npm", "start" ]