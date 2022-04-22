const request = require('./request')
const querystring = require('querystring')
const { API } = require('./const')
const { appendParam, getNowMilliSecond } = require('./utils')

function brain (message, token) {
  const param = {
    engine: 'uapp',
    needcontent: 'yes',
    opmode: 'remote',
    syncmode: 'yes',
    ttssplit: 'no'
  }
  const url = appendParam(API.SERVICE_ROBOOT, querystring.stringify(param))
  const time = getNowMilliSecond()

  return request({
    url,
    method: 'POST',
    headers: {
      accessToken: token,
      timestamp: time,
      deviceId: 'u.zO7R6y70zFgHAT-xBWfdl_',
      language: 'zh-CN'
    },
    data: message
  })
}

function aiService (msg, token) {
  const message = { 'query': msg }
  return brain(message, token)
}

module.exports = aiService
