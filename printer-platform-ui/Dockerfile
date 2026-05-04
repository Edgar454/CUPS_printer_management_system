# Build stage
FROM node:20 AS builder
WORKDIR /app

COPY printer-platform-ui/package*.json ./
RUN npm install
COPY printer-platform-ui/ .

RUN npm install --save-dev @types/node
RUN npm run build

# Serve static files with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY printer-platform-ui/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]