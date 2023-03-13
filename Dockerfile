FROM node:14

WORKDIR /app

COPY package.json .

RUN npm install

COPY . . 

ENV PORT 3000

ENV GOOGLE_APPLICATION_CREDENTIAL \app\tts-api-account.json

EXPOSE $PORT

CMD ["npm", "start"]