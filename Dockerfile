FROM node:current-alpine AS builder-base
RUN apk add python make gcc g++ --no-cache
RUN npm install -g npm@latest

FROM builder-base AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM builder-base AS runner
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production && npm cache clean --force
COPY --from=builder /app/dist ./dist
EXPOSE ${port}
CMD npm start
