const {getConfig} = require('./setConfig')
const {fetchSite} = require('./fetchSite')

async function rss2json(){
    let rssFeeds = getConfig()
    for (const sourceName in rssFeeds){
        const res = await fetchSite(rssFeeds[sourceName].url)
        rssFeeds[sourceName]['data'] = await rssFeeds[sourceName].parser(res)
    }
    return rssFeeds
}

module.exports = {
    rss2json
}