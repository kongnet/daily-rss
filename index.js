const schedule = require('node-schedule')
const {rss2md} = require('./lib/rss2md')
const {rss2html} = require('./lib/rss2html')
const {rss2json} = require('./lib/rss2json')
const {setConfig} = require('./lib/setConfig')
const convert = require('xml-js')

module.exports = {
    convert,
    rss2json,
    rss2html,
    rss2md,
    setConfig
}