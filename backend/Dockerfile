FROM node:16-alpine AS builder
WORKDIR /app
COPY ./package*.json .
RUN npm ci --audit=false
COPY . .
RUN npm run build

FROM node:16-alpine
WORKDIR /app
COPY ./package*.json .
RUN npm ci --omit=dev --audit=false && npm i -g pm2
COPY --from=builder /app/dist ./dist
COPY ./ecosystem.config.js .
EXPOSE 3000
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
