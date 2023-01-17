const $ = require('meeko')
const {fetchSite,parseFeed} = require('./parseFeed')
const path = require("path");
const util = require("util");
const fs = require("fs");
const { siteUrlMap,commonName } = require('../config')
const convert = require("xml-js");

const docsifyPath = path.join(__dirname, `../www/markdown/`) // markdown文件输出文件夹
const docPath = `docs/` // markdown文件输出文件夹
const sidebarPath = `${docsifyPath}_sidebar.md`
const sidebarTemplatePath = `${docsifyPath}_sidebar_template.md`

async function getBing() {
    const res = await fetchSite('https://rsshub.app/bing')
    const rst = convert.xml2json(await res, {
        compact: true,
        spaces: 0
    })
    const item = JSON.parse(rst)?.rss?.channel?.item[0]
    if (item) {
        return {title:item.title, pic:descToUrl(item?.description?._cdata)}
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

async function start(obj) {
    const monTime = $.now().format('YYYY-MM')
    const dayTime = $.now().format('YYYY-MM-DD')
    const fileDir = `${docsifyPath}${docPath}`

    const monthDir = `${fileDir}${monTime}`
    if (!hFs.mkdir(monthDir)) return false

    const filePath = `${monthDir}/${dayTime}.md`
    if (fs.existsSync(filePath)) return false

    const mds = await genMD(obj)
    hFs.saveFile(filePath,mds)

    const files = await readFilePath(fileDir)
    setSideBar(files)
}

function setSideBar(files) {
    let result = []
    let arr = []
    for (const file in files) {
        arr.push(+file)
    }
    arr.sort()
    arr.reverse()
    arr.forEach(a=> {
        if(a<200000) return
        const monStr = `${Math.floor(a/100)}-${a%100<10?'0'+a%100:a%100}`
        result.push(`- [${monStr}](docs/${monStr}/)`)
        let arr2 = []
        for (const file2 in files[a]){
            arr2.push(+file2)
        }
        arr2.sort()
        arr2.reverse()
        arr2.forEach(v => {
            if (v<200000) return
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
    result.push(`> ${bing?.title?._cdata}`)

    for (const source in obj) {
        result.push(`## ${commonName[source]?commonName[source]:source}`)
        obj[source].forEach((v,i) => {
            result.push(`### ${i+1}. ${v.title}`)
            result.push(`> ${v?.desc?._cdata.replace(/(<([^>]+)>)/gi, '').replace(/[\r\n]/g, '  \r\n> ')}`)
            result.push(`[查看详情](${v.link})`)
        })
    }
    return result.join('\n')
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
                // 是一个文件夹
                modules[key] = await readFilePath(path.join(dir, name))
            }
        } catch (e) {
            modules[key] = false
        }
    }
    return modules
}

const hFs = {
    // 给文件/文件夹重命名，成功返回true，否则返回false
    async rename (oldPath, newPath) {
        try {
            return !(await util.promisify(fs.rename)(oldPath, newPath))
        } catch (e) {
            return false
        }
    },

    /**
     * 读取文件
     * */
    async readFile (filePath) {
        try {
            return await util.promisify(fs.readFile)(filePath)
        } catch (e) {
            return false
        }
    },

    // 读取目录
    async readdir (path, options) {
        try {
            return await util.promisify(fs.readdir)(path, options)
        } catch (e) {
            return false
        }
    },

    /**
     * 保存文件
     *
     * ps. 这个方法默认会覆盖文件全部内容
     *
     * @param filePath string 文件路径，要含文件名和扩展名，反正这个方法里不会自动给你加
     * @param fileData string | buffer 可以是字符串，也可以是buffer，是要保存的内容
     * @return boolean 保存成功还是失败
     * */
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

                // 块方式写入文件
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

    /**
     * 创建多级目录，如果成功，或者目录早已存在，则返回true，否则返回false
     * @param dir string 需要创建的文件夹
     * @return boolean
     * */
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

async function rss2md(rssList) {
    const obj = {}
    for (const sourceName of rssList) {
        if (!siteUrlMap[sourceName]){
            console.error('invalid rss resource:',sourceName)
            continue
        }
        const res = await fetchSite(siteUrlMap[sourceName])
        obj[sourceName] = await parseFeed(res, sourceName)
    }
    await start(obj)
}

module.exports = {rss2md}