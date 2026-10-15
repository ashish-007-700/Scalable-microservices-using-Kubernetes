# Use the official Node.js 18 Alpine image for a small container size
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies first (for Docker layer caching)
COPY package.json .
RUN npm install --production

# Copy the application source code
COPY index.js .

# Expose the port the app runs on
EXPOSE 3001

# Start the application
CMD ["npm", "start"]
