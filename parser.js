const convert = require('xml-js')

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

const rssParser = async url => {
    const res = await fetchSite(url)
    const rst = convert.xml2json(await res.text(), {
        compact: true,
        spaces: 0
    })
    const items = JSON.parse(rst).rss.channel.item
    return items.map(x => {
        return { title: x.title._cdata, link: x.link._text, desc: x.description._cdata }
    })
}

const HackerNewsParser = async url => {
    const res = await fetchSite(url)
    const items = (await res.json()).items
    return items.map(x => {
        return { title: x.title, link: x.url, desc: x.content_html }
    })
}

const V2EXParser = async url => {
    const res = await fetchSite(url)
    const rst = convert.xml2json(await res.text(), {
        compact: true,
        spaces: 0
    })
    const items = JSON.parse(rst).feed.entry
    return items.map(x => {
        return { title: x.title._text, link: x.link._attributes.href, desc: x.content._cdata }
    })
}

module.exports = {
    fetchSite,
    rssParser,
    HackerNewsParser,
    V2EXParser
}
