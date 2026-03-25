#!/bin/bash
# ================================================================
#  Roam Richer — Universal Deploy Script
#  Supports: Amazon Linux 2023 · Ubuntu 20/22/24 · Debian 11/12/13
#
#  BEFORE running this on a fresh VM:
#    1. Cloudflare DNS → roamricher.com:
#       Add A record:  @   → <vm-public-ip>   (proxy OFF = grey cloud)
#       Add A record:  www → <vm-public-ip>   (proxy OFF = grey cloud)
#    2. AWS / Hetzner / VPS Security Group / Firewall:
#       Allow inbound: 22 (SSH), 80 (HTTP), 443 (HTTPS)
#
#  Run on the VM (single command):
#    curl -fsSL https://raw.githubusercontent.com/ahasdeviya01-sudo/roamricher-landing01/main/deploy.sh | bash
#
#  After SSL cert is issued:
#    → Cloudflare: turn proxy ON (orange cloud) for both A records
#    → Cloudflare: SSL/TLS mode → "Full (strict)"
# ================================================================
set -e

DOMAIN="roamricher.com"
REPO="https://github.com/ahasdeviya01-sudo/roamricher-landing01.git"
APP_DIR="/var/www/roamricher"
EMAIL="hello@roamricher.com"

PUBLIC_IP=$(curl -s --max-time 5 ifconfig.me 2>/dev/null || \
            curl -s --max-time 5 checkip.amazonaws.com 2>/dev/null || \
            echo "unknown")

# ── Detect OS ────────────────────────────────────────────────────
detect_os() {
  if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS_ID="${ID,,}"          # amazon, ubuntu, debian, etc.
    OS_VER="${VERSION_ID}"
  else
    echo "ERROR: Cannot detect OS. /etc/os-release not found." && exit 1
  fi

  case "$OS_ID" in
    amzn)       PKG="dnf"; OS_LABEL="Amazon Linux ${OS_VER}"; NGINX_CONF_DIR="/etc/nginx/conf.d" ;;
    ubuntu)     PKG="apt"; OS_LABEL="Ubuntu ${OS_VER}";       NGINX_CONF_DIR="/etc/nginx/sites-available" ;;
    debian)     PKG="apt"; OS_LABEL="Debian ${OS_VER}";       NGINX_CONF_DIR="/etc/nginx/sites-available" ;;
    *)          echo "WARNING: Unrecognised OS '$OS_ID'. Assuming apt-based."
                PKG="apt"; OS_LABEL="Linux (${OS_ID} ${OS_VER})"; NGINX_CONF_DIR="/etc/nginx/sites-available" ;;
  esac
}

detect_os

NGINX_CONF_FILE="$NGINX_CONF_DIR/roamricher.conf"

echo ""
echo "================================================================"
echo "  Roam Richer — Server Setup"
echo "  OS           : $OS_LABEL"
echo "  VM Public IP : $PUBLIC_IP"
echo "  Domain       : $DOMAIN"
echo "================================================================"
echo ""

# ── 1. System updates ────────────────────────────────────────────
echo "[1/8] Updating system packages..."
if [ "$PKG" = "dnf" ]; then
  sudo dnf update -y -q
else
  sudo apt-get update -qq
  sudo DEBIAN_FRONTEND=noninteractive apt-get upgrade -y -qq
fi

# ── 2. Install Node.js 20 LTS ────────────────────────────────────
echo "[2/8] Installing Node.js 20 LTS..."
if ! command -v node &> /dev/null; then
  if [ "$PKG" = "dnf" ]; then
    curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
    sudo dnf install -y nodejs
  else
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
  fi
fi
echo "  Node: $(node -v)  |  npm: $(npm -v)"

# ── 3. Install PM2 globally ──────────────────────────────────────
echo "[3/8] Installing PM2..."
sudo npm install -g pm2 --silent
echo "  PM2: $(pm2 -v)"

# ── 4. Install Nginx ─────────────────────────────────────────────
echo "[4/8] Installing Nginx..."
if [ "$PKG" = "dnf" ]; then
  sudo dnf install -y nginx
else
  sudo apt-get install -y nginx
fi
sudo systemctl enable --now nginx

# ── 5. Clone / pull the app ──────────────────────────────────────
echo "[5/8] Cloning / updating app from GitHub..."
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
  echo "  ⚠️  No .env found — creating one now."
  echo "  Enter your 3 Gemini API keys (press Enter after each):"
  echo ""
  read -rp "  GEMINI_API_KEY_1: " KEY1
  read -rp "  GEMINI_API_KEY_2: " KEY2
  read -rp "  GEMINI_API_KEY_3: " KEY3
  cat > "$APP_DIR/.env" << ENV
GEMINI_API_KEY_1=${KEY1}
GEMINI_API_KEY_2=${KEY2}
GEMINI_API_KEY_3=${KEY3}
PORT=3001
ENV
  echo "  .env created ✅"
fi

# ── 6. Build the frontend ────────────────────────────────────────
echo "[6/8] Installing npm packages & building frontend..."
cd "$APP_DIR"
npm install --silent
npm run build
echo "  Build complete ✅  (dist/ ready)"

# ── 7. Configure Nginx ───────────────────────────────────────────
echo "[7/8] Configuring Nginx..."
sudo mkdir -p "$NGINX_CONF_DIR"
sudo cp "$APP_DIR/nginx/roamricher.conf" "$NGINX_CONF_FILE"

if [ "$PKG" = "apt" ]; then
  # Debian/Ubuntu: enable via sites-enabled symlink
  sudo ln -sf "$NGINX_CONF_FILE" /etc/nginx/sites-enabled/roamricher.conf
  # Disable default site to avoid conflicts
  sudo rm -f /etc/nginx/sites-enabled/default
else
  # Amazon Linux: conf.d is auto-loaded — remove default if any
  sudo rm -f /etc/nginx/conf.d/default.conf
fi

sudo nginx -t && sudo systemctl reload nginx
echo "  Nginx configured ✅"

# ── 8. SSL via Let's Encrypt + Certbot ───────────────────────────
echo "[8/8] Setting up SSL..."
echo ""
echo "  ⚠️  Certbot needs to reach port 80 on $DOMAIN directly."
echo "     Make sure Cloudflare proxy is OFF (grey cloud) right now."
echo ""
read -rp "  Is DNS pointed to $PUBLIC_IP with proxy OFF? [y/N]: " CONFIRM

if [[ "$CONFIRM" =~ ^[Yy]$ ]]; then
  # Install certbot — method differs by OS
  if [ "$PKG" = "dnf" ]; then
    # Amazon Linux 2023 — certbot via pip (most reliable)
    if ! command -v certbot &>/dev/null; then
      sudo dnf install -y python3-pip augeas-libs
      sudo python3 -m venv /opt/certbot/
      sudo /opt/certbot/bin/pip install --quiet --upgrade pip
      sudo /opt/certbot/bin/pip install --quiet certbot certbot-nginx
      sudo ln -sf /opt/certbot/bin/certbot /usr/bin/certbot
    fi
  else
    # Ubuntu/Debian — certbot via snap (official recommended way)
    sudo apt-get install -y snapd
    sudo snap install core 2>/dev/null; sudo snap refresh core 2>/dev/null
    sudo snap install --classic certbot
    sudo ln -sf /snap/bin/certbot /usr/bin/certbot 2>/dev/null || true
  fi

  # Obtain certificate
  sudo certbot --nginx \
    --non-interactive \
    --agree-tos \
    --email "$EMAIL" \
    --redirect \
    -d "$DOMAIN" \
    -d "www.$DOMAIN"

  # Auto-renew via cron (works on all distros)
  (sudo crontab -l 2>/dev/null; echo "0 3 * * * /usr/bin/certbot renew --quiet --post-hook 'systemctl reload nginx'") \
    | sort -u | sudo crontab -

  echo ""
  echo "  SSL certificate issued ✅  (auto-renews via cron)"
  echo ""
  echo "  ──────────────────────────────────────────────────"
  echo "  NOW in Cloudflare dashboard:"
  echo "    1. DNS → turn proxy ON (orange cloud) for @ and www"
  echo "    2. SSL/TLS → Overview → set mode to 'Full (strict)'"
  echo "  ──────────────────────────────────────────────────"
else
  echo ""
  echo "  ⏭  Skipped SSL. Run later manually:"
  echo "     sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
fi

# ── Start app with PM2 ───────────────────────────────────────────
echo ""
echo "Starting / restarting app with PM2..."
pm2 stop roamricher 2>/dev/null || true
pm2 start "$APP_DIR/ecosystem.config.cjs"
pm2 save

# PM2 auto-start on reboot
PM2_STARTUP=$(pm2 startup systemd -u "$USER" --hp "$HOME" 2>&1 | grep "sudo env" || true)
if [ -n "$PM2_STARTUP" ]; then
  echo "$PM2_STARTUP" | sudo bash
fi

echo ""
echo "================================================================"
echo "  ✅  Roam Richer is LIVE!"
echo ""
echo "  URL          : https://$DOMAIN"
echo "  App port     : 3001 (internal, not exposed to internet)"
echo "  Nginx        : port 80 → 443 → proxy → 3001"
echo ""
echo "  Useful commands:"
echo "    pm2 logs roamricher        — live server logs"
echo "    pm2 status                 — running process info"
echo "    pm2 restart roamricher     — restart app"
echo ""
echo "  To update after a git push:"
echo "    cd $APP_DIR && git pull && npm run build && pm2 restart roamricher"
echo "================================================================"
