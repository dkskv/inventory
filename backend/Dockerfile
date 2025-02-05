FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --production

COPY dist ./dist
COPY public ./public

COPY shared ./shared
COPY db ./db
COPY tsconfig.json ./

CMD ["sh", "-c", "yarn migration:run && yarn start:prod"]