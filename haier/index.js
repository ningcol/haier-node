const login = require('./login')
const aiService = require('./roboot')
const { isObject } = require('./utils')

class Haier {
  constructor (tokenInfo, username, pwd) {
    if (isObject(tokenInfo) && tokenInfo != null) {
      console.log('constructor-session')
      this.session = this.session(tokenInfo)
    } else {
      console.log('constructor登陆登陆')
      if (!username || !pwd) throw new Error('参数不合法')
      this.session = login(username, pwd)
    }
  }

  async session (tokenInfo) {
    return {
      accountToken: tokenInfo.accountToken,
      expiresIn: tokenInfo.expiresIn
    }
  }

  connect () {
    return this.session.then(ss => ({
      accountToken: ss.accountToken,
      expiresIn: ss.expiresIn
    }))
  }

  async aiService (msg) {
    return this.session.then(ss => aiService(msg, ss.accountToken))
  }
}

module.exports = Haier
