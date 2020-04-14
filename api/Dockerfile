FROM node:12-slim
WORKDIR /app
COPY package.json /app
RUN npm install --only=prod --loglevel=error
COPY . /app
CMD ["npm", "start"]
