const schedule = require('node-schedule')
const {siteUrlMap} = require("./config");
const {rss2md} = require("./job/rss2md");

let h12 = 60*60*12
let timerCount = 0

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

    schedule.scheduleJob('*/1 *  * * * *', () => {
        timerCount += 1
        if (timerCount % h12 === 0) {
            genMd()
        }
    })
}

startTask()