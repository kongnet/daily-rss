const $ = require('meeko')
const dailyRss = require('../index')
const config = {
  baseConfig: {
    outputFile: 'rss-output.html'
  },
  siteUrlMap: {
    zhihu: 'https://www.zhihu.com/rss',
    ruanyifeng: 'http://feeds.feedburner.com/ruanyifeng',
    sspai: 'https://sspai.com/feed',
    ifanr: 'https://www.ifanr.com/feed',
    zaobao: 'https://plink.anyfeeder.com/zaobao/realtime/china',
    nytimes: 'https://plink.anyfeeder.com/nytimes/cn',
    xueqiu: 'https://xueqiu.com/hots/topic/rss',
    thepaper: 'https://plink.anyfeeder.com/thepaper',
    '36kr': '	https://36kr.com/feed'
  },
  commonName: {
    zhihu: '知乎',
    ruanyifeng: '阮一峰',
    sspai: '少数派',
    ifanr: '爱酷范',
    zaobao: '中港台联合早报',
    nytimes: '纽约时报',
    xueqiu: '雪球',
    thepaper: '澎湃新闻',
    '36kr': '36kr'
  }
}

const rssHubParser = async res => {
  let rst
  try {
    rst = dailyRss.convert.xml2json(await res.text(), {
      compact: true,
      spaces: 0
    })
  } catch (e) {
    console.log(e)
    rst = '{}'
  }

  let items = JSON.parse(rst)?.rss?.channel?.item || []
  if (!(items instanceof Array)) {
    items = [items]
  }
  return items.map(x => {
    return {
      title: x.title?._text || x.title?._cdata,
      link: x.link?._text || x.link?._cdata,
      desc: x.description?._text || x.description?._cdata
    }
  })
}
const adaptor = {
  zhihu: rssHubParser,
  ruanyifeng: rssHubParser,
  sspai: rssHubParser,
  ifanr: rssHubParser,
  zaobao: rssHubParser,
  nytimes: rssHubParser,
  xueqiu: rssHubParser,
  jianshuio: rssHubParser,
  thepaper: rssHubParser,
  '36kr': rssHubParser
}

async function main () {
  try {
    dailyRss.setConfig(config.siteUrlMap, adaptor)
    const data = await dailyRss.rss2json()
    await dailyRss.rss2html(data)
  } catch (e) {
    console.log(e.message)
  }
}

main()

/*
1.fetch rss list
2.parseFeed 
3.renderFeed [html,markdown,pdf]
*/
