# Daily-RSS

### Introduction 简介

> 简易每日聚合 RSS 生成页面框架  
> Simple Daily Aggregation RSS Generated Page Framework  
> 跨服务器支持,全静态页面  
> Cross-server support, fully static pages

### Read Online 现在阅读

https://daily.skykong.xyz

### Install & Run 安装和运行

```
- 0. nodejs 18.x.x & npm i -g pm2
- 1. git clone https://github.com/kongnet/daily-rss.git
- 2. node .
```

### Customization 定制化

- 1. modify rssFeeds in config 修改 config.js 中的网站映射
- 2. modify parse function in parse.js 修改 parseAdapy.js 中对应的网站解析代码 title,link,description

### Step 实现步骤

- 1. fetch RSS sitelist 获取待聚合网站列表
- 2. parse RSS data 解析 RSS 数据
- 3. render 渲染(html md)
- 4. crontab 设置定时任务
- 5. website 配置网站显示前端数据
  - a. Nginx setting 配置 Nginx
  - b. Https setting 配置 Https
  - c. or Docker

[Get code](https://github.com/kongnet/daily-rss)
