FROM node:current-alpine AS builder-base
RUN apk add python make gcc g++ --no-cache
RUN npm install -g yarn

FROM builder-base AS builder
WORKDIR /app
COPY package*.json ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM builder-base AS runner
WORKDIR /app
COPY package*.json ./
RUN yarn install --production && yarn cache clean --force
COPY --from=builder /app/dist ./dist
EXPOSE ${port}
CMD yarn start
