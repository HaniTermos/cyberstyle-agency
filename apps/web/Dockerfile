FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package.json package-lock.json* .npmrc* ./
COPY apps/web/package.json ./apps/web/package.json
COPY apps/api/package.json ./apps/api/package.json
COPY packages ./packages
COPY prisma ./prisma

RUN --mount=type=cache,target=/root/.npm npm ci --legacy-peer-deps
RUN npx prisma generate

COPY . .

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["npm", "run", "dev", "--workspace=@cyberstyle/web"]