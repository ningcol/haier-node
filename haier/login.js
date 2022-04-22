const request = require('./request')
const HaierError = require('./haierError')
const url = require('url')
const { API, PHONE_TYPE, APP_ID, APP_KEY } = require('./const')
const { sha256, getNowMilliSecond, trimAll } = require('./utils')

async function login (account, pwd) {
  const time = getNowMilliSecond()
  const data = {
    username: account,
    password: pwd,
    phoneType: PHONE_TYPE
  }
  const resp = await request({
    url: API.SERVICE_LOGIN,
    method: 'post',
    data: data,
    headers: {
      sign: sha256(trimAll(url.parse(API.SERVICE_LOGIN).pathname + JSON.stringify(data) + APP_ID +
      APP_KEY + time)),
      timestamp: time
    }
  }).catch(e => {
    if (e.rep.status != 200) {
      console.log('权限验证失败')
    }
    throw e
  })

  if (resp.retCode != '00000') {
    throw new HaierError(resp.retCode, JSON.stringify(resp.retInfo))
  }
  return {
    accountToken: resp.data.tokenInfo.accountToken,
    expiresIn: resp.data.tokenInfo.expiresIn
  }
}

module.exports = login
