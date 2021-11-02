FROM node:16.6.1
WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

EXPOSE 6001

CMD npm run start
