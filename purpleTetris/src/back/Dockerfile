# Use an official Node.js runtime as a parent image
FROM node:21-alpine

# Set the working directory
WORKDIR /app
RUN     apk update
RUN     apk add curl

#COPY    ./redTetrisBack/package.json .
#COPY    ./redTetrisBack/package-lock.json .
#COPY    ./redTetrisBack/node_modules .
COPY    redTetrisBack/ .

RUN     rm -rf node_modules
# Install dependencies
RUN     npm install


EXPOSE 3000

# Run BrowserSync
CMD ["npm", "run", "start"]
