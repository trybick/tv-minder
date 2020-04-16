FROM node:12-slim

WORKDIR /app
COPY package.json /app

# Dependencies
RUN npm install --only=prod -s
# Dev dependencies that are skipped
RUN npm install module-alias nodemon -s
# Global packages
RUN npm install typescript tsc-watch -g -s

COPY . /app

CMD ["npm", "start"]
