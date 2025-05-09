FROM node:24-alpine

COPY . .

RUN npm install -g http-server

CMD ["http-server", "-p", "80"]