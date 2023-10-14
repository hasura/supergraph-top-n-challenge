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

RUN chmod 777 health-check.sh 

# Expose a port (e.g., 4000) that your application will listen on
EXPOSE 8000

# Define the command to run your application
CMD [ "npx", "grafbase", "dev", "--port", "8000" ]
