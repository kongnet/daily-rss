const { convert } = require('../index')

const rssHubParser = async res => {
  let rst
  try {
    rst = convert.xml2json(await res.text(), {
      compact: true,
      spaces: 0
    })
  } catch (e) {
    console.log(e)
    rst = '{}'
  }

  const items = JSON.parse(rst)?.rss?.channel?.item || []
  return items.map(x => {
    return {
      title: x.title._cdata,
      link: x.link._text || x.link._cdata,
      desc: x.description._cdata
    }
  })
}

const HackerNewsParser = async res => {
  const items = (await res.json()).items
  return items.map(x => {
    return { title: x.title, link: x.url, desc: x.content_html }
  })
}

const V2EXParser = async res => {
  const rst = convert.xml2json(await res.text(), {
    compact: true,
    spaces: 0
  })
  const items = JSON.parse(rst).feed.entry
  return items.map(x => {
    return {
      title: x.title._text,
      link: x.link._attributes.href,
      desc: x.content._cdata
    }
  })
}

module.exports = {
  odaily: rssHubParser,
  'Hacker News': HackerNewsParser,
  V2EX: V2EXParser,
  Solidot: rssHubParser,
  ZNews: rssHubParser,
  Dribbble: rssHubParser,
  Github: rssHubParser,
  'AP News': rssHubParser,
  blockbeats: rssHubParser,
  chainfeeds: async res => {
    const rst = convert.xml2json(await res.text(), {
      compact: true,
      spaces: 0
    })
    const items = JSON.parse(rst).feed.entry
    return items.map(x => {
      return {
        title: x.title._text,
        link: x.link._attributes,
        desc: x.summary._cdata
      }
    })
  }
}
