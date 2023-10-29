# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Bundle your source code inside the Docker image
COPY . .

# Expose a port (e.g., 8000) that your application will listen on
EXPOSE 8000

# Define the command to run your application
CMD [ "npm", "start" ]
