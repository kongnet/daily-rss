const {baseConfig} = require("../defaultSever/config")
const $ = require("meeko")
const fs = require("fs")

function renderHtml(feedList, sourceName) {
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

async function rss2html(rssFeeds) {
    try {
        let rssList = []
        for (const sourceName in rssFeeds) {
            rssList.push(renderHtml(rssFeeds[sourceName]['data'], sourceName))
        }
        let htmlStr = $.tools.genTemp.genHtml('', rssList.join(''))
        fs.writeFileSync(baseConfig.outputFile, htmlStr)
    }catch (e) {
        console.log(e)
    }
}

module.exports = {rss2html}