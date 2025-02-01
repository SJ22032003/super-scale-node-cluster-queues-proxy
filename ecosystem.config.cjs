module.exports = {
  apps : [{
    name: "clustring server",
    script: 'bun run dist/bundle.js',
    watch: '.',
    instances: 'MAX',
    autorestart: true,
    max_memory_restart: '1G', // this means that if the memory usage of the process exceeds 1 GB, the process will be restarted.
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    },
  }, {
    script: './service-worker/',
    watch: ['./service-worker']
  }],

  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
