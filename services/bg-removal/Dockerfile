# Use Node.js 20 LTS
FROM node:20-slim

# Install system dependencies for canvas/sharp/onnx
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    libvips-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install

# Copy application source
COPY . .

# Expose the service port
EXPOSE 8080

# Run the application
CMD ["npm", "start"]
