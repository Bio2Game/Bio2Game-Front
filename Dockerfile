FROM node:14
WORKDIR /app
COPY . .

RUN yarn
RUN yarn build

EXPOSE 6001

CMD yarn start
