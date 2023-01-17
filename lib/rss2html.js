const {fetchSite, parseFeed} = require("./parseFeed");
const {siteUrlMap, baseConfig} = require("../config");
const $ = require("meeko");
const fs = require("fs");
async function renderHtml(feedList, sourceName) {
    let dataArr = feedList.map(x => {
        return [`<a href="${x.link}">${x.title}</a>`]
    })
    return $.tools.genTemp.gridTable(
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
}

async function rss2html(rssArr) {
    try {
        let rssList = []
        for (const i of rssArr) {
            const sourceName = rssArr[i]
            if (!siteUrlMap[sourceName]){
                console.error('invalid rss resource:',sourceName)
                continue
            }
            const res = await fetchSite(siteUrlMap[sourceName])
            const parseRst = await parseFeed(res, sourceName)
            rssList.push(renderHtml(parseRst, sourceName))
        }
        let htmlStr = $.tools.genTemp.genHtml('', rssList.join(''))
        fs.writeFileSync(baseConfig.outputFile, htmlStr)
    }catch (e) {
        console.log(e)
    }
}

module.exports = {rss2html}