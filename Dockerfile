# Use a base image
FROM node:18.16

# Set the working directory
WORKDIR /usr/src/app

# # Copy package.json and package-lock.json
COPY package*.json .

# Install dependencies
RUN npm install

# Copy the application code
COPY . .

# Set environment variables if needed
ENV PORT=4500

# Expose the desired port
EXPOSE $PORT

# Run the tests
# RUN npm run test:e2e

# Start the application
CMD ["npm", "run", "dev"]

