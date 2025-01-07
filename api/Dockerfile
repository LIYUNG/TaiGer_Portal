# FROM node:18-alpine

# Test aws ecr
FROM public.ecr.aws/docker/library/node:18.20.5-alpine

# Install Node.js 18.x and npm using NodeSource
RUN curl -sL https://rpm.nodesource.com/setup_18.x | bash - && \
    yum install -y nodejs

WORKDIR /app
COPY . .
RUN npm install --production 

USER node
CMD [ "npm", "start" ]