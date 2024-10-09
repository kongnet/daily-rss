module.exports = {
  baseConfig: {
    outputFile: 'rss-output.html'
  },
  siteUrlMap: {
    odaily: 'https://www.odaily.news/v1/openapi/odailyrss',
    blockbeats: 'https://api.theblockbeats.news/v1/open-api/home-xml',
    chainfeeds: 'https://chainfeeds.xyz/rss',
    'Hacker News': 'https://hnrss.org/newest.jsonfeed?points=100',
    V2EX: 'https://www.v2ex.com/index.xml',
    Solidot: 'https://www.solidot.org/index.rss'
    // ZNews: 'https://rsshub.app/zaobao/znews/china',
    // Dribbble: 'https://rsshub.app/dribbble/popular/week',
    // Github: 'https://rsshub.app/github/trending/daily/any/any',
    // 'AP News': 'https://rsshub.app/apnews/topics/ap-top-news'
  },
  commonName: {
    odaily: '星球日报',
    blockbeats: '律动'
  }
}

// const rssFeedsDefault = {
//   odaily: 'https://rsshub.app/odaily/newsflash',
//   'Hacker News': 'https://hnrss.org/newest.jsonfeed?points=100',
//   V2EX: 'https://www.v2ex.com/index.xml',
//   Solidot: 'https://rsshub.app/solidot/linux',
//   ZNews: 'https://rsshub.app/zaobao/znews/china',
//   Dribbble: 'https://rsshub.app/dribbble/popular/week',
//   Github: 'https://rsshub.app/github/trending/daily/any/any',
//   blockbeats:''
// }

// module.exports = {
//   baseConfig: {
//     outputFile: 'rss-output.html'
//   },
//   rssFeedsDefault
// }
