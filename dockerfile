#빌드
FROM node:18 as build
WORKDIR /sdh_site
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

#서비스
FROM node:18-slim
WORKDIR /app
COPY --from=build /sdh_site/build ./build
RUN npm install -g serve

ENV PORT 21120
EXPOSE $PORT

CMD ["serve", "-s", "build", "-l", "21120"]
