FROM mhart/alpine-node:latest

EXPOSE 3000

WORKDIR /opt/api

COPY . .

RUN apk add --no-cache make gcc g++ python git
RUN npm install
RUN npm rebuild --build-from-source

CMD ["npm","start"]
