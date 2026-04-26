# Етап 1: Збірка
FROM node:20-alpine AS builder

WORKDIR /app

# Копіюємо файли залежностей
COPY package*.json ./
RUN npm install

# Копіюємо решту файлів та компілюємо TypeScript
COPY . .
RUN npm run build

# Етап 2: Запуск
FROM node:20-alpine

WORKDIR /app

# Копіюємо лише необхідні файли з етапу збірки
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/database ./database

EXPOSE 3000

CMD ["node", "dist/index.js"]