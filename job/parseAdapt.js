const convert = require('xml-js')
const rsshubParse = async res => {
  const rst = convert.xml2json(await res.text(), {
    compact: true,
    spaces: 0
  })
  const items = JSON.parse(rst).rss.channel.item
  return items.map(x => {
    return { title: x.title._cdata, link: x.link._text, desc: x.description._cdata }
  })
}
module.exports = {
  'odaily': rsshubParse,
  'Hacker News': async function (res) {
    const items = (await res.json()).items
    return items.map(x => {
      return { title: x.title, link: x.url, desc: x.content_html }
    })
  },
  V2EX: async function (res) {
    const rst = convert.xml2json(await res.text(), {
      compact: true,
      spaces: 0
    })
    const items = JSON.parse(rst).feed.entry
    return items.map(x => {
      return { title: x.title._text, link: x.link._attributes.href, desc: x.content._cdata }
    })
  },

  Solidot: rsshubParse,
  ZNews: rsshubParse,
  Dribbble: rsshubParse,
  Github: rsshubParse,
  'AP News': rsshubParse
}
