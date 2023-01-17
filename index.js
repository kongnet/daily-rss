const $ = require('meeko')

const {siteUrlMap } = require('./config')
const {rss2md} = require("./job/rss2md");

async function fetchSite (url) {
  return await fetch(url, {
    headers: {
      accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'accept-language': 'zh-CN,zh;q=0.9',
      'cache-control': 'no-cache'
    },
    referrerPolicy: 'strict-origin-when-cross-origin',
    body: null,
    method: 'GET',
    mode: 'cors',
    credentials: 'include'
  })
}

async function main () {
  try {
    const rssList = []
    for (const rss in siteUrlMap){
      rssList.push(rss)
    }
    await rss2md(rssList)
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
