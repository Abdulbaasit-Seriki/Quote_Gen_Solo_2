FROM node:12
WORKDIR /usr/app/backend
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8888
CMD ["npm","start"]
