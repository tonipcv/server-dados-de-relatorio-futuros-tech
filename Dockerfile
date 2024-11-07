FROM node:18

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY .env ./
COPY index.js ./

RUN npm install
RUN npx prisma generate

EXPOSE 3000

CMD ["node", "index.js"] 