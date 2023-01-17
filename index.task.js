const schedule = require('node-schedule')
const {siteUrlMap} = require("./config");
const {rss2md} = require("./job/rss2md");

async function genMd() {
    try {
        const rssList = []
        for (const rss in siteUrlMap){
            rssList.push(rss)
        }
        await rss2md(rssList)
    } catch (e) {
        console.log(e)
    }
}

async function startTask() {
    setInterval(() => {},1000)
    schedule.scheduleJob('47 47 2 * * *', function () {
        genMd()
    })
}

startTask()