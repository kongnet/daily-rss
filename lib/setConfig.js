let rssObj = {}

function setConfig(rssMap = {}, adaptorMap = {}) {
    for (const sourceName in rssMap) {
        if (!adaptorMap[sourceName]) {
            console.error('Failed to find parser of ', sourceName)
            return null
        }
        rssObj[sourceName] = {
            url: rssMap[sourceName],
            parser: adaptorMap[sourceName]
        }
    }
    return true
}

function getConfig() {
    return rssObj
}

module.exports = {
    setConfig,
    getConfig
}