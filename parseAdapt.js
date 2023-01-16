const convert = require('xml-js')
module.exports = {
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
