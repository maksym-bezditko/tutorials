FROM node:14-alpine as build

WORKDIR /opt/app

COPY --chown=node:node package.json .

RUN npm install

COPY --chown=node:node . .

RUN npm run build

FROM node:14-alpine

WORKDIR /opt/app

COPY --chown=node:node --from=build /opt/app/node_modules ./node_modules

COPY --chown=node:node --from=build /opt/app/dist ./dist

CMD ["node", "dist/main.js"]