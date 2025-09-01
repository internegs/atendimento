FROM node:20-alpine
LABEL authors="Moises"

RUN corepack enable && corepack install -g yarn@4.9.4

WORKDIR /app

COPY .yarnrc.yml package.json yarn.lock ./
COPY . .

RUN yarn install

EXPOSE 8081

CMD ["yarn", "dev", "--host"]