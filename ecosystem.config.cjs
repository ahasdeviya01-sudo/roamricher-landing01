/**
 * PM2 Ecosystem Config — Roam Richer
 * Docs: https://pm2.keymetrics.io/docs/usage/application-declaration/
 *
 * Usage on VM:
 *   pm2 start ecosystem.config.cjs
 *   pm2 save          ← persist across reboots
 *   pm2 startup       ← auto-start on boot (follow the printed command)
 */
module.exports = {
  apps: [
    {
      name: 'roamricher',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/roamricher',   // adjust if you clone elsewhere
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
    },
  ],
};
