# CYBERSTYLE LLC — Production VPS Deployment Guide

## 1. Prerequisites on Linux VPS (Ubuntu 22.04 / 24.04 LTS)

```bash
# Install Docker and Docker Compose
sudo apt update && sudo apt install -y docker.io docker-compose git certbot
sudo systemctl enable --now docker
```

---

## 2. SSL / TLS Certificate Provisioning with Certbot

```bash
# Obtain Let's Encrypt certificates before starting Nginx
sudo certbot certonly --standalone -d cyberstyle.net -d www.cyberstyle.net -d api.cyberstyle.net --agree-tos -m admin@cyberstyle.net --non-interactive
```

---

## 3. Environment Configuration & Launch

```bash
# 1. Clone repository on VPS
git clone https://github.com/cyberstyle/platform.git /var/www/cyberstyle
cd /var/www/cyberstyle

# 2. Copy and configure production environment variables
cp .env.example .env
nano .env

# 3. Launch Docker Compose production stack
docker-compose -f docker-compose.prod.yml up -d --build

# 4. Run Prisma database migrations and seed initial data
docker exec -it cyberstyle_api npx prisma migrate deploy
docker exec -it cyberstyle_api npx ts-node prisma/seed.ts
```

---

## 4. Automated Nightly Backups & Cron Setup

```bash
# Add to root crontab (runs every midnight)
0 0 * * * /var/www/cyberstyle/infra/scripts/backup-postgres.sh >> /var/log/cyberstyle_backup.log 2>&1
```
