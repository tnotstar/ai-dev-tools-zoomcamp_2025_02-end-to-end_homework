FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy backend source code
COPY backend ./backend

# Expose the API port
EXPOSE 3000

# Start the server
CMD ["npm", "run", "server"]
