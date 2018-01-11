FROM mhart/alpine-node:latest

EXPOSE 3000

WORKDIR /opt/api

COPY . .

RUN apk add --no-cache make gcc g++ python
RUN npm install

CMD ["node","index.js"]
