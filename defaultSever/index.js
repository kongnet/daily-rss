const schedule = require('node-schedule')
const dailyRss = require('../index')
const config = require('./config')
const adaptor = require('./adaptor')

function rss2mdDaily () {
  schedule.scheduleJob(`0 9 * * *`, async function () {
    try {
      dailyRss.setConfig(config.siteUrlMap, adaptor)
      const data = await dailyRss.rss2json()
      await dailyRss.rss2md(data)
    } catch (e) {
      console.log(e.message)
    }
  })
}

rss2mdDaily()
