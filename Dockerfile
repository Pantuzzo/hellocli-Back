FROM node:20-alpine AS builder

WORKDIR /app

# 1. Copia apenas o necessário para instalação
COPY package*.json ./
COPY prisma ./prisma

# 2. Instala dependências
RUN npm ci && npx prisma generate

# 3. Copia apenas os arquivos de build necessários
COPY src ./src
COPY tsconfig*.json ./
COPY nest-cli.json ./

# 4. Build
RUN npm run build

# Stage de produção
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

EXPOSE 8081
CMD ["node", "dist/main"]