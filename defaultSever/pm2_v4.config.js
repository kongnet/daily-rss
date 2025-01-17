const port = []
const appName = []
const apps = []
const env = 'local'

apps.push({
  name: 'daily:crontab:' + env,
  script: 'index.js',
  kill_timeout: 10000,
  autorestart: false,
  watch: false,
  max_memory_restart: '1G',
  log_date_format: 'YYYY-MM-DD HH:mm:ss SSS',
  // 默认启动这个环境
  env: {
    NODE_ENV: env
  }
})

apps.push({
  name: 'daily-web:' + env,
  script: 'index_web.js',
  kill_timeout: 10000,
  autorestart: false,
  watch: false,
  max_memory_restart: '1G',
  log_date_format: 'YYYY-MM-DD HH:mm:ss SSS',
  // 默认启动这个环境
  env: {
    NODE_ENV: env
  }
})

module.exports = {
  apps
}
