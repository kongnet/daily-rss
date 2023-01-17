const axios = require('axios')
const axiosRetry = require('axios-retry')
const HttpsProxyAgent = require('https-proxy-agent')

const httpsAgent = new HttpsProxyAgent('http://127.0.0.1:7890')
const request = axios.create({ proxy: false, httpsAgent })
axiosRetry(request, {
    retries: 3,
    retryDelay: (retryCount) => {
        // console.log('retryCount:' + retryCount)
        return retryCount * 1000
    },
    retryCondition: (error) => {
        // console.log(error.message)
        //true为打开自动发送请求，false为关闭自动发送请求
        if (error.message.includes('timeout') || error.message.includes('status code')) {
            return true
        } else {
            return false
        }
    }
})

module.exports = request

