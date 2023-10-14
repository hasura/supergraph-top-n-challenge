# Use an official Golang runtime as a parent image
FROM golang:latest

# Set the working directory inside the container
WORKDIR /app

# Copy the local package files to the container's workspace
COPY . .

# Build the Go application
RUN go build

# Expose the port your Go application uses (adjust as needed)
EXPOSE 4002

# Define the entry point for the container
CMD ["./post"]
