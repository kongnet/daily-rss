const parsers = require("./parser")

const rssFeeds = {
    'odaily': {
        url: 'https://rsshub.app/odaily/newsflash',
        alias: '星球日报',
        parser: parsers.rssParser
    },
    'Hacker News': {
        url: 'https://hnrss.org/newest.jsonfeed?points=100',
        parser: parsers.HackerNewsParser
    },
    'V2EX': {
        url: 'https://www.v2ex.com/index.xml',
        parser: parsers.V2EXParser
    },
    'Solidot': {
        url: 'https://rsshub.app/solidot/linux',
        parser: parsers.rssParser
    },
    'ZNews': {
        url: 'https://rsshub.app/zaobao/znews/china',
        parser: parsers.rssParser
    },
    'Dribbble': {
        url: 'https://rsshub.app/dribbble/popular/week',
        parser: parsers.rssParser
    },
    'Github': {
        url: 'https://rsshub.app/github/trending/daily/any/any',
        parser: parsers.rssParser
    },
    'AP News': {
        url: 'https://rsshub.app/apnews/topics/ap-top-news',
        parser: parsers.rssParser
    }
}

module.exports = {
    baseConfig: {
        outputFile: 'rss-output.html'
    },
    rssFeeds
}
