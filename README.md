# Daily-RSS

### Intro 简介

> Cross-server support, fully static pages
> 跨服务器支持,全静态页面

### Install & Run 安装和运行

```
- 0. nodejs 18.x.x & npm i -g pm2
- 1. git clone https://github.com/kongnet/daily-rss.git
- 2. pm2 start index
```

### Step 实现步骤

- 1. fetch RSS sitelist 获取待聚合网站列表
- 2. parse RSS data 解析 RSS 数据
- 3. render 渲染(html md)
- 4. crontab 设置定时任务
- 5. website 配置网站显示前端数据
  - a. Nginx setting 配置 Nginx
  - b. Https setting 配置 Https
  - c. or Docker
