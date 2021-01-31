FROM node:14
WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

EXPOSE 6001

CMD npm run start
