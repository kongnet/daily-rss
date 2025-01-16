# Daily-RSS

### Introduction 简介

> 简易每日聚合 RSS 生成页面框架  
> Simple Daily Aggregation RSS Generated Page Framework  
> 跨服务器支持,全静态页面  
> Cross-server support, fully static pages

### Read Online 现在阅读

https://news.nftmeta.vip/#/

### Version Dependency 版本依赖

nodejs version: >=18.x.x
 
### Install 安装

```
npm install daily-rss
```

### Example 用例

```
const rss = require('daily-rss')

//modify config
const config = {
    'people' : 'http://www.people.com.cn/rss/politics.xml'
}

//modify adaptor, return the array of objects (title,link,description)
const adaptor = {
    'people': async res => {
        const rst = rss.convert.xml2json(await res.text(), {
            compact: true,
            spaces: 0
        })
        const items = JSON.parse(rst).rss.channel.item
        return items.map(x => {
            return { title: x.title._cdata, link: x.link._text, desc: x.description._cdata }
        })
    }
}

async function main() {
    rss.setConfig(config,adaptor)
    const data = await rss.rss2json()
    rss.rss2md(data)
}
```

### Step 实现步骤

- 1. set rss url and adaptor 配置rss源和对应的解析函数
- 2. parse RSS data 解析 RSS 数据
- 3. render 渲染(html md)
- 4. crontab 设置定时任务
- 5. website 配置网站显示前端数据
  - a. Nginx setting 配置 Nginx
  - b. Https setting 配置 Https
  - c. or Docker

[Get code](https://github.com/kongnet/daily-rss)
