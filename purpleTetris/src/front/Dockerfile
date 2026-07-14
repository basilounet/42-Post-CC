# Use an official Node.js runtime as a parent image
FROM node:24-alpine

ARG VITE_API_ADDRESS
ENV VITE_API_ADDRESS=${VITE_API_ADDRESS}
ARG VITE_FRONT_PORT
ENV VITE_ADDRESS=${VITE_ADDRESS}
#ARG ADDR
#
ENV VITE_FRONT_PORT=${VITE_FRONT_PORT}
#ENV ADDR=${ADDR}

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY    redTetrisFront/package*.json ./

# Install dependencies
RUN     npm install
RUN     #npm audit fix

# Copy the rest of the application code
COPY redTetrisFront .

#RUN npm run build

#RUN sed -i "s/DUMMY_FRONT_PORT/${FRONT_PORT}/g" /app/vite.config.js
#RUN sed -i "s/DUMMY_ADDRESS/${ADDR}/g" /app/src/ts/immanence.ts

# Expose the port that BrowserSync will run on
EXPOSE 5000

# Run BrowserSync
CMD ["npm", "run", "dev"]
