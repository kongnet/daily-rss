const schedule = require('node-schedule')
const {rss2md} = require('./lib/rss2md')
const {rss2html} = require('./lib/rss2html')

function rss2mdDaily(hour, rssFeeds) {
    schedule.scheduleJob(`1 1 2 ${hour} * *`, function () {
        rss2md(rssFeeds)
    })
}

function rss2htmlDaily(hour, rssFeeds) {
    schedule.scheduleJob(`1 1 ${hour} * * *`, function () {
        rss2html(rssFeeds)
    })
}

module.exports = {
    rss2md,
    rss2mdDaily,
    rss2html,
    rss2htmlDaily
}