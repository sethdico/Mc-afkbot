FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY index.js ./
RUN mkdir -p /app/auth

ENV MC_HOST=
ENV MC_PORT=
ENV MC_USERNAME=AFKBot

CMD ["node", "index.js"]
