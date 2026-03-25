#!/bin/bash
# ============================================================
#  Roam Richer — AWS Ubuntu VM Deploy Script
#  Run this ONCE on a fresh Ubuntu 22.04 VM:
#    chmod +x deploy.sh && ./deploy.sh
# ============================================================
set -e

REPO="https://github.com/ahasdeviya01-sudo/roamricher-landing01.git"
APP_DIR="/var/www/roamricher"
NGINX_CONF="/etc/nginx/sites-available/roamricher"

echo ""
echo "===========================================" 
echo "  Roam Richer — Server Setup"
echo "==========================================="
echo ""

# ── 1. System updates ─────────────────────────────────────
echo "[1/7] Updating system packages..."
sudo apt-get update -qq && sudo apt-get upgrade -y -qq

# ── 2. Install Node.js 20 LTS ─────────────────────────────
echo "[2/7] Installing Node.js 20 LTS..."
if ! command -v node &> /dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi
echo "  Node: $(node -v)  |  npm: $(npm -v)"

# ── 3. Install PM2 ────────────────────────────────────────
echo "[3/7] Installing PM2..."
sudo npm install -g pm2 --silent
echo "  PM2: $(pm2 -v)"

# ── 4. Install Nginx ──────────────────────────────────────
echo "[4/7] Installing Nginx..."
sudo apt-get install -y nginx -qq
sudo systemctl enable nginx

# ── 5. Clone / pull the app ───────────────────────────────
echo "[5/7] Cloning / updating app..."
if [ -d "$APP_DIR/.git" ]; then
  echo "  Repo exists — pulling latest..."
  cd "$APP_DIR" && git pull origin main
else
  sudo mkdir -p "$APP_DIR"
  sudo chown "$USER":"$USER" "$APP_DIR"
  git clone "$REPO" "$APP_DIR"
  cd "$APP_DIR"
fi

# Create .env if it doesn't exist
if [ ! -f "$APP_DIR/.env" ]; then
  echo ""
  echo "  ⚠️  No .env file found. Creating one now."
  echo "  Please paste your 3 Gemini API keys below."
  echo ""
  read -p "  GEMINI_API_KEY_1: " KEY1
  read -p "  GEMINI_API_KEY_2: " KEY2
  read -p "  GEMINI_API_KEY_3: " KEY3
  cat > "$APP_DIR/.env" << ENV
GEMINI_API_KEY_1=$KEY1
GEMINI_API_KEY_2=$KEY2
GEMINI_API_KEY_3=$KEY3
PORT=3001
ENV
  echo "  .env created ✅"
fi

# ── 6. Install dependencies & build ──────────────────────
echo "[6/7] Installing npm packages & building..."
cd "$APP_DIR"
npm install --silent
npm run build
echo "  Build complete ✅  (dist/ ready)"

# ── 7. Configure Nginx ────────────────────────────────────
echo "[7/7] Configuring Nginx..."
sudo cp "$APP_DIR/nginx/roamricher.conf" "$NGINX_CONF"
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/roamricher
sudo nginx -t && sudo systemctl reload nginx
echo "  Nginx configured ✅"

# ── Start / restart app with PM2 ─────────────────────────
echo ""
echo "Starting app with PM2..."
pm2 stop roamricher 2>/dev/null || true
pm2 start "$APP_DIR/ecosystem.config.cjs"
pm2 save

echo ""
echo "  Setting PM2 to auto-start on reboot..."
pm2 startup systemd -u "$USER" --hp "$HOME" | tail -1 | sudo bash || \
  echo "  Run the 'sudo env PATH=...' command printed above to enable auto-start."

echo ""
echo "==========================================="
echo "  ✅  Roam Richer is LIVE!"
echo ""
echo "  App runs on  : http://localhost:3001"
echo "  Nginx proxies: http://<your-vm-ip>  →  port 80"
echo ""
echo "  Useful commands:"
echo "    pm2 logs roamricher       — live logs"
echo "    pm2 status                — process status"
echo "    pm2 restart roamricher    — restart app"
echo ""
echo "  To update the app later, just run:"
echo "    cd $APP_DIR && git pull && npm run build && pm2 restart roamricher"
echo "==========================================="
