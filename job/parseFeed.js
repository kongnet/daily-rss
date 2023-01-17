const parseAdapt = require("./parseAdapt");

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

async function parseFeed (res, source = 'v2ex') {
    return await parseAdapt[source](res)
}

function renderFeed (feedList, sourceName = 'v2ex', renderType = 'html') {
    if (renderType === 'html') {
        return renderHtml(feedList, sourceName)
    }else if (renderType === 'markdown') {
        return renderMarkdown(feedList, sourceName)
    }
    return ''
}

module.exports = {
    fetchSite,
    parseFeed
}