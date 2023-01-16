const $ = require('meeko')
const fs = require('fs')

const { baseConfig, siteUrlMap } = require('./config')
const parseAdapt = require('./parseAdapt')

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
  if (renderType === 'html') {
    return renderHtml(feedList, sourceName)
  }else if (renderType === 'markdown') {
    return renderMarkdown(feedList, sourceName)
  }
  return ''
}

async function renderMarkdown(feedList, sourceName) {

}

async function renderHtml(feedList, sourceName) {
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
      console.log(sourceName, ',parse cpmplete.')
      rssList.push(renderFeed(parseRst, sourceName, (renderType = 'html')))
    }

    let htmlStr = $.tools.genTemp.genHtml('', rssList.join(''))
    fs.writeFileSync(baseConfig.outputFile, htmlStr)
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
