# SentinelGrid Dockerfile
FROM node:18-alpine

# Backend setup
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .

# Frontend build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install --production
RUN npm run build

# Expose (if you want to serve frontend statically)
EXPOSE 3000

# Default command (customize as needed)
CMD ["npm", "start"]
