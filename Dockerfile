# Stage 1: Build the frontend
FROM node:18-alpine AS build

# Set working directory for frontend build
WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm install

# Copy frontend source code
COPY frontend/ .

# Build the frontend (outputs to dist/)
RUN npm run build


# Stage 2: Setup the backend and serve the application
FROM node:18-alpine

# Set working directory for the final image
WORKDIR /app

# Copy root package files (where backend deps are)
COPY package*.json ./

# Install backend dependencies (production only)
RUN npm install --production

# Copy backend source code to /app/backend
COPY backend/ ./backend/

# Copy built frontend artifacts from Stage 1 to 'public' folder in backend
COPY --from=build /app/frontend/dist ./backend/public

# Expose the application port
EXPOSE 3000

# Start the server
CMD ["node", "backend/server.js"]
