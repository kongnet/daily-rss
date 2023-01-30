const $ = require('meeko')
const {fetchSite} = require('../parser')
const path = require("path")
const util = require("util")
const fs = require("fs")
const convert = require("xml-js")

const docsifyPath = path.join(process.cwd(), `/www/markdown/`)
const docPath = `docs/`
const sidebarPath = `${docsifyPath}_sidebar.md`
const sidebarTemplatePath = `${docsifyPath}_sidebar_template.md`

async function getBing() {
    const res = await fetchSite('https://rsshub.app/bing')
    const rst = convert.xml2json(await res.text(), {
        compact: true,
        spaces: 0
    })
    const item = JSON.parse(rst)?.rss?.channel?.item[0]
    if (item) {
        return {title:item.title._cdata, pic:descToUrl(item?.description?._cdata)}
    }
    return {}
}

function descToUrl(desc) {
    if (!desc) {
        return ''
    }
    const arr = desc.split(`"`)
    if (arr.length>2) {
        return arr[1]
    }
    return ''
}

async function renderMD(data) {
    if (!fs.existsSync(docsifyPath)) {
        fs.cpSync(path.join(__dirname, `../www`),'./www/', {recursive:true})
    }
    const monTime = $.now().format('YYYY-MM')
    const dayTime = $.now().format('YYYY-MM-DD')
    const fileDir = `${docsifyPath}${docPath}`

    const monthDir = `${fileDir}${monTime}`
    if (!hFs.mkdir(monthDir)) return false

    const monReadmePath = `${monthDir}/README.md`
    if (!fs.existsSync(monReadmePath)){
        await hFs.saveFile(monReadmePath, '#')
    }
    const filePath = `${monthDir}/${dayTime}.md`
    if (!fs.existsSync(filePath)) {
        const mds = await genMD(data)
        await hFs.saveFile(filePath, mds)
    }else{
        console.log(`${dayTime}.md has existed`)
    }

    await $.wait(1000)
    const files = await readFilePath(fileDir)
    setSideBar(files)
}

function setSideBar(files) {
    let result = []
    let arr = Object.keys(files)
    arr.sort()
    arr.reverse()
    arr.forEach(a=> {
        if(a<200000) return
        const monStr = `${Math.floor(a/100)}-${a%100<10?'0'+a%100:a%100}`
        result.push(`- [${monStr}](docs/${monStr}/)`)
        let arr2 = Object.keys(files[a])
        arr2.sort()
        arr2.reverse()
        arr2.forEach(v => {
            if (v<200000 || v==='README') return
            const dayStr = `${monStr}-${v%100<10?'0'+v%100:v%100}`
            result.push(`    - [${dayStr}](docs/${monStr}/${dayStr}.md)`)
        })
    })

    let data = fs.readFileSync(sidebarTemplatePath)
    hFs.saveFile(sidebarPath,data.toString()+'\n\n'+result.join('\n'))
}

async function genMD(obj) {
    const result = []
    result.push(`# 每日新闻 ${$.now().format('YYYY-MM-DD')}`)
    const bing = await getBing()
    result.push(`![](${bing.pic})`)
    result.push(`> ${bing?.title}  `)
    result.push(' ')
    result.push(`## [历史上的今天](today-html/${$.now().format('MMDD')}.html)`)
    for (const source in obj) {
        result.push(`## ${obj[source]['name']?obj[source]['name']:source}`)
        obj[source]['data'].forEach((v,i) => {
            result.push(`### ${i+1}. ${v.title}`)
            result.push(setDesc(v.desc))
            result.push(`[查看详情](${v.link})`)
        })
    }
    return result.join('\n')
}

function setDesc(desc) {
    try{
        let rst = `> ${desc.replace(/<style>[\s\S]*<\/style>/gi,'').replace(/(<([^>]+)>)/gi, '').replace(/[\r\n]/g, '  \r\n> ').replaceAll('#','')}`
        if (!rst) {
            return ''
        }
        // if (rst.length > 350) {
        //     rst = rst.slice(0,350)+'...'
        // }
        return rst
    }catch (e) {
        console.log(e.message)
    }
}


async function readFilePath (dir) {
    const files = (await hFs.readdir(dir)) || []
    const modules = {}
    for (const file of files) {
        const [name, ext] = file.split('.')
        const key = name.split('-').join('')
        try {
            if (ext) {
                modules[key] = path.join(dir, file)
            } else {
                modules[key] = await readFilePath(path.join(dir, name))
            }
        } catch (e) {
            modules[key] = false
        }
    }
    return modules
}

const hFs = {
    async rename (oldPath, newPath) {
        try {
            return !(await util.promisify(fs.rename)(oldPath, newPath))
        } catch (e) {
            return false
        }
    },

    async readFile (filePath) {
        try {
            return await util.promisify(fs.readFile)(filePath)
        } catch (e) {
            return false
        }
    },

    async readdir (path, options) {
        try {
            return await util.promisify(fs.readdir)(path, options)
        } catch (e) {
            return false
        }
    },

    saveFile (filePath, fileData) {
        return this.mkdir(
            filePath
                .split(path.sep)
                .slice(0, -1)
                .join(path.sep)
        ).then(function (succ) {
            if (!succ) {
                return false
            }

            return new Promise((resolve, reject) => {
                if (!(fileData instanceof Buffer)) {
                    fileData = Buffer.from(fileData)
                }

                const wstream = fs.createWriteStream(filePath)

                wstream.on('open', () => {
                    const blockSize = 128
                    const nbBlocks = Math.ceil(fileData.length / blockSize)
                    for (let i = 0; i < nbBlocks; i++) {
                        const currentBlock = fileData.slice(
                            blockSize * i,
                            Math.min(blockSize * (i + 1), fileData.length)
                        )
                        wstream.write(currentBlock)
                    }

                    wstream.end()
                })
                wstream.on('error', err => {
                    console.log('save file failed：', err)
                    resolve(false)
                })
                wstream.on('finish', () => {
                    resolve(true)
                })
            })
        })
    },

    async mkdir (dir) {
        if (!dir) {
            return false
        }
        try {
            await util.promisify(fs.mkdir)(dir, {
                recursive: true
            })
            return true
        } catch (e) {
            let msg = 'create directory failed:'
            if (e.code === 'EEXIST') {
                return true
            } else if (e.code === 'ENOENT') {
                msg = 'The upper-level directory does not exist:'
            }
            console.log(msg, e.code, e.message)
        }
        return false
    }
}

async function rss2md(rssFeeds) {
    try{
        const data = Object.assign({},rssFeeds)
        for (const sourceName in rssFeeds){
            data[sourceName]['data'] = await rssFeeds[sourceName].parser(rssFeeds[sourceName].url)
        }
        await renderMD(data)
    }catch (e) {
        console.log(e.message)
    }
}

module.exports = {rss2md}