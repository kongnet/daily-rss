const $ = require('meeko')

const { rssFeeds } = require('./config')
const {rss2md, rss2html} = require("./index")


async function main () {
  try {
    await rss2md(rssFeeds)
    await rss2html(rssFeeds)
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
