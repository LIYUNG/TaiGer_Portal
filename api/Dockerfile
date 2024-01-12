FROM node:18-alpine AS dependencies
RUN apk add --no-cache libc6-compat

WORKDIR /app
COPY package.json yarn.lock ./

RUN yarn install --production 

FROM node:18-alpine AS runner
WORKDIR /app

COPY . .
COPY --from=dependencies /app/ ./

USER node
ENV PORT=3000
EXPOSE $PORT
CMD [ "yarn", "start" ]