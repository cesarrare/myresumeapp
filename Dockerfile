# ==========================
# Build Stage
# ==========================
FROM node:22-alpine AS builder

WORKDIR /app

# Copiar dependencias primero para aprovechar la caché
COPY package*.json ./

RUN npm ci

# Copiar el resto del proyecto (.env incluido)
COPY . .

# Generar el build de producción
RUN npm run build

# ==========================
# Runtime Stage
# ==========================
FROM nginx:1.29-alpine

# Copiar configuración de Nginx para React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar la aplicación compilada
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]