const $ = require('meeko')

const config = require('./config')
const adaptor = require('./adaptor')
const dailyRss = require("../index")


async function main () {
  try {
    dailyRss.setConfig(config.rssFeedsDefault, adaptor)
    const data = await dailyRss.rss2json()
    await dailyRss.rss2md(data)
    await dailyRss.rss2html(data)
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
