FROM node:18-alpine AS builder

WORKDIR /app

# Copy các tệp cấu hình package
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/

# Cài đặt dependencies
RUN npm install --workspace=web

# Copy mã nguồn frontend
COPY apps/web ./apps/web

# Build Next.js app
RUN npm run build --workspace=web

# --- Giai đoạn chạy ---
FROM node:18-alpine AS runner

WORKDIR /app

# Copy build files từ builder
COPY --from=builder /app/apps/web/package.json ./apps/web/
COPY --from=builder /app/apps/web/next.config.js ./apps/web/
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/.next/standalone ./apps/web/
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "apps/web/server.js"]
