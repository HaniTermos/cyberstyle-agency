FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package.json package-lock.json* .npmrc* ./
COPY apps/api/package.json ./apps/api/package.json
COPY apps/web/package.json ./apps/web/package.json
COPY packages ./packages
COPY prisma ./prisma

RUN --mount=type=cache,target=/root/.npm npm install --legacy-peer-deps --no-audit
RUN npx prisma generate

COPY . .

EXPOSE 4000
CMD ["sh", "-c", "npx prisma generate && npx prisma db push && node prisma/seed_faqs.js && node prisma/seed_reviews.js && node prisma/seed_admin.js && npm run dev:direct --workspace=@cyberstyle/api"]