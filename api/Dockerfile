FROM --platform=linux/arm64/v8 node:18-alpine
WORKDIR /code

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . .

# Specify the default command to run
CMD [ "npm", "start" ]