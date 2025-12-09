FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose the port (Cloud Run will inject PORT env var, defaulting to 5173 locally)
EXPOSE 5173

# Start the development server, listening on the injected PORT or 5173
CMD ["sh", "-c", "npm run dev -- --host --port ${PORT:-5173}"]
