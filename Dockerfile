FROM node:current-alpine
WORKDIR /app
COPY package*.json ./
RUN apk add python make gcc g++ --no-cache
RUN npm ci
COPY . .
RUN npm run build

FROM node:current-alpine
WORKDIR /app
COPY package*.json ./
RUN apk add python make gcc g++ --no-cache
RUN npm install --only=production
COPY --from=0 /app/dist ./dist
EXPOSE ${port}
CMD npm start
