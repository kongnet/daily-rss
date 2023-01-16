const convert = require('xml-js')
const Config = require('./config')
const $ = require('meeko')
const fs = require('fs')

const siteUrlMap = {
  'Hacker News': 'https://hnrss.org/newest.jsonfeed?points=100',
  V2EX: 'https://www.v2ex.com/index.xml',
  Solidot: 'https://rsshub.app/solidot/linux',
  ZNews: 'https://rsshub.app/zaobao/znews/china',
  Dribbble: 'https://rsshub.app/dribbble/popular/week',
  Github: 'https://rsshub.app/github/trending/daily/any/any',
  'AP News': 'https://rsshub.app/apnews/topics/ap-top-news'
}
const parseAdapt = {
  'Hacker News': async function (res) {
    const items = (await res.json()).items
    return items.map(x => {
      return { title: x.title, link: x.url }
    })
  },
  V2EX: async function (res) {
    const rst = convert.xml2json(await res.text(), {
      compact: true,
      spaces: 0
    })
    const items = JSON.parse(rst).feed.entry
    return items.map(x => {
      return { title: x.title._text, link: x.link._attributes.href }
    })
  },

  Solidot: async function (res) {
    const rst = convert.xml2json(await res.text(), {
      compact: true,
      spaces: 0
    })
    const items = JSON.parse(rst).rss.channel.item
    return items.map(x => {
      return { title: x.title._cdata, link: x.link._text }
    })
  },
  ZNews: async function (res) {
    const rst = convert.xml2json(await res.text(), {
      compact: true,
      spaces: 0
    })
    const items = JSON.parse(rst).rss.channel.item
    return items.map(x => {
      return { title: x.title._cdata, link: x.link._text }
    })
  },
  Dribbble: async function (res) {
    const rst = convert.xml2json(await res.text(), {
      compact: true,
      spaces: 0
    })
    const items = JSON.parse(rst).rss.channel.item
    return items.map(x => {
      return { title: x.title._cdata, link: x.link._text }
    })
  },
  Github: async function (res) {
    const rst = convert.xml2json(await res.text(), {
      compact: true,
      spaces: 0
    })
    const items = JSON.parse(rst).rss.channel.item
    return items.map(x => {
      return { title: x.title._cdata, link: x.link._text }
    })
  },
  'AP News': async function (res) {
    const rst = convert.xml2json(await res.text(), {
      compact: true,
      spaces: 0
    })
    const items = JSON.parse(rst).rss.channel.item
    return items.map(x => {
      return { title: x.title._cdata, link: x.link._text }
    })
  }
}
async function fetchSite (url) {
  const res = await fetch(url, {
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
  return res
}
async function parseFeed (res, source = 'v2ex') {
  return await parseAdapt[source](res)
}
function renderFeed (feedList, sourceName = 'v2ex', renderType = 'html') {
  let dataArr = feedList.map(x => {
    return [`<a href="${x.link}">${x.title}</a>`]
  })
  let allStr = $.tools.genTemp.gridTable(
    [
      {
        dataTitleArr: ['Title'],
        dataArr: dataArr,
        dataTitle: sourceName + ' ' + new Date().date2Str()
      }
    ],
    'close',
    true
  )
  return allStr
}
async function main () {
  try {
    const rssList = []
    for (let i in siteUrlMap) {
      const sourceName = i
      const res = await fetchSite(siteUrlMap[sourceName])
      const parseRst = await parseFeed(res, (source = sourceName))
      rssList.push(renderFeed(parseRst, sourceName, (renderType = 'html')))
    }

    let htmlStr = $.tools.genTemp.genHtml('', rssList.join(''))
    fs.writeFileSync(Config.outputFile, htmlStr)
    // const sourceName = 'solidot/linux'
    // const res = await fetchSite(siteUrlMap[sourceName])
    // const parseRst = await parseFeed(res, (source = sourceName))
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
