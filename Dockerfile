# ==========================
# Build Stage
# ==========================
FROM node:22-alpine AS builder

WORKDIR /app

# Copiar dependencias primero para aprovechar la caché
COPY package*.json ./

RUN npm ci

# Copiar el resto del proyecto
COPY . .

# Injected at image build time from CI (GitHub secret GOOGLE_CLIENT_ID).
# Overrides any VITE_GOOGLE_CLIENT_ID from .env.production.
ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

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
