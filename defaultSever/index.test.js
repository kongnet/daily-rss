const $ = require('meeko')

const config = require('./config')
const adaptor = require('./adaptor')
const dailyRss = require('../index')

async function main () {
  try {
    dailyRss.setConfig(config.siteUrlMap, adaptor)
    const data = await dailyRss.rss2json()
    // console.log(data.Github.data[0])
    await dailyRss.rss2md(data)
  } catch (e) {
    console.log(e)
  }
}

main()

/*
1.fetch rss list
2.parseFeed 
3.renderFeed [html,markdown,pdf]
*/
