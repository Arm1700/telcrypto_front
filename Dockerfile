FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies)
RUN npm ci

# Copy source code
COPY . .

# Create symlink for react-refresh
RUN ln -sf /app/node_modules/react-refresh/runtime.js /app/src/react-refresh-runtime.js

# Expose port
EXPOSE 3000

# Set environment variable for better hot reloading in Docker
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true
ENV FAST_REFRESH=false

# Start the application
CMD ["npm", "start"]