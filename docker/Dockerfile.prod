# ./docker/Dockerfile.prod

# Stage 1: Build TS to JS
FROM node:22.14.0-alpineAS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY tsconfig.json ./
COPY src ./src
COPY .eslintrc.js ./

RUN yarn build

# Stage 2: Run Production Server
FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/lang ./dist/lang 

ENV NODE_ENV=production

CMD ["node", "--import", "tsx", "dist/server.js"]
