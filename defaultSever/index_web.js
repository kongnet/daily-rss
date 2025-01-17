const sky = require('skybase')
let config = require('./config')
const skyConfig = require('./skyconfig')
const $ = require('meeko')

config.beforeMount = async () => {}
config = Object.assign(config, skyConfig) //将默认config和本地的config合并
sky.start(config, async () => {})
