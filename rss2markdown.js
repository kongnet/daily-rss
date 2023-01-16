const $ = require('meeko')

const docsifyPath = `../www/markdown/` // markdown文件输出文件夹
const apiDocPath = `apis/` // markdown文件输出文件夹

async function start(feedList, sourceName) {
    const time = $.now().format('YYYYMMDDHHmmss')
    const fileDir = `${docsifyPath}${apiDocPath}newest/`
    const historys = await readFiles(path.join(__dirname, fileDir))
}