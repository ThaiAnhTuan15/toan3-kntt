FROM node:18-alpine AS builder

WORKDIR /app

# Khai báo biến môi trường cho quá trình build
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Copy package files (tối ưu hóa cache)
COPY package*.json ./
COPY database/package*.json ./database/
COPY apps/api/package*.json ./apps/api/
COPY packages/types/package*.json ./packages/types/
COPY packages/validation/package*.json ./packages/validation/

# Cài đặt toàn bộ dependencies (bao gồm cả dev)
RUN npm install

# Copy toàn bộ mã nguồn
COPY . .

# Generate Prisma client & build Type/Validation packages
RUN npm run db:generate
RUN cd packages/types && npm run build
RUN cd packages/validation && npm run build

# Build API App
RUN cd apps/api && npm run build

# --- Chuyển sang giai đoạn Production (Giảm dung lượng ảnh) ---
FROM node:18-alpine AS runner

WORKDIR /app

# Chỉ copy những file cần thiết từ Builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/database ./database
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=builder /app/apps/api/dist ./apps/api/dist

# Expose port
EXPOSE 4000

# Lệnh khởi động
CMD ["node", "apps/api/dist/index.js"]
