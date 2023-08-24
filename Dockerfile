FROM node:18.17.1-alpine3.18

USER node

RUN mkdir -p /home/node/app/node_modules
RUN chown node:node /home/node/app/node_modules

WORKDIR /home/node/app

COPY --chown=node:node package*.json .
COPY --chown=node:node .npmrc .
RUN npm ci

COPY --chown=node:node knexfile.js .
COPY --chown=node:node migrations/ migrations/

COPY --chown=node:node tailwind.config.js .
COPY --chown=node:node postcss.config.js .
