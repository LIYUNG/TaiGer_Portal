# FROM node:18-alpine

# Test aws ecr
FROM public.ecr.aws/lts/nodejs:18-alpine

WORKDIR /app
COPY . .
RUN npm install --production 

USER node
CMD [ "npm", "start" ]