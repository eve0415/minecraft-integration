FROM node:current-alpine AS builder-base
RUN apk add python make gcc g++ git --no-cache

FROM builder-base AS builder
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM builder-base AS runner
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --production && yarn cache clean
COPY --from=builder /app/dist ./dist
EXPOSE ${port}
CMD yarn start