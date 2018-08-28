FROM node:8

WORKDIR /app

# add package.json
ADD package*.json ./
ADD webapp/package*.json ./webapp/

# install
RUN npm install
RUN cd webapp && npm install

# add source code
ADD . .
COPY example.env .env

# build api
RUN npm run build

# build webapp (VUE_APP_API_URL_VALUE will get replaced with actual API_URL at runtime)
ENV VUE_APP_API_URL VUE_APP_API_URL_VALUE 
RUN cd webapp && npm run build

# start
EXPOSE 3000
CMD ["node", "dist/src/main.js"]