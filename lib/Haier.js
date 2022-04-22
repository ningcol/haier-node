const HaierApi = require('../haier')
const NodeCache = require('node-cache')

class Haier {
  constructor (node, config) {
    this.node = node
    this.config = config
    if (this.config) {
      this.config.username = this.config.credentials.username
    }
    this.cache = new NodeCache({ checkperiod: 600 })
  }

  // 登录
  getSession () {
    return new Promise(async (resolve, reject) => {
      try {
        let client
        let jsonData = this.getToken()
        // console.log('获取缓存数据' + JSON.stringify(jsonData))
        if (!jsonData || !jsonData.accountToken) {
          client = new HaierApi(null, this.config.credentials.username, this.config.credentials.password)
          jsonData = await client.connect()
          //   console.log('登录返回' + jsonData)
          this.cacheToken(jsonData, jsonData.expiresIn)
        } else {
          const { accountToken, expiresIn } = jsonData
          client = new HaierApi({ accountToken, expiresIn })
        }
        resolve(client)
      } catch (err) {
        reject(err)
      }
    })
  }

  cacheToken (data, ttl) {
    this.cache.set('token', data, ttl)
    // console.log('设置缓存成功')
  }

  getToken () {
    const token = this.cache.get('token')
    if (token == undefined) {
      return null
    }
    return token
  }

  aiService (message) {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await this.getSession().then(client => client.aiService(message))
        resolve(data)
      } catch (error) {
        reject(error)
      }
    })
  }
}

module.exports = Haier
