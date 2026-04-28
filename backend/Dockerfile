# build stage
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

# Copy rest of the files and compile TypeScript
COPY . .
RUN npm run build

# run stage
FROM node:20-alpine

WORKDIR /app

# Copy only necessary files from the build stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/database ./database

EXPOSE 3000

CMD ["node", "dist/index.js"]