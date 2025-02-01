module.exports = {
  apps: [{
    name: "clustering-server",
    script: './dist/bundle.cjs',
    watch: false,  // Change to false to prevent auto-reloading issues
    instances: 'MAX',
    autorestart: true,
    max_memory_restart: '1G',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 3001
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
};