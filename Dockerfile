FROM node:12.10
WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

EXPOSE 6001

CMD npm run start