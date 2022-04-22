const fetch = require('node-fetch')
const querystring = require('querystring')
const { appendParam } = require('./utils')
const { USER_AGENT, APP_VER, APP_ID } = require('./const')

class HttpError extends Error {
  constructor (rep) {
    super()

    this.rep = rep
    this.retInfo = rep.retInfo
    this.message = [
      'Request Error',
      `url: ${rep.url}`,
      `retInfo: ${rep.retInfo}`,
      `code: ${rep.retCode}`
    ].join('\n')
    this.message += '\n'
  }
}

function request ({
  url = '',
  method = 'GET',
  data,
  type = 'json',
  headers = {}
}) {
  method = typeof method === 'string' ? method.toUpperCase() : 'GET'
  const options = {
    method: method,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      //   Connection: 'keep-alive',
      'User-Agent': USER_AGENT,
      Accept: '*/*',
      'appId': APP_ID,
      'appVersion': APP_VER,
      'clientId': '6EF3AD23-F110-45C8-85D8-CFB02CB76124',
      ...headers
    }
  }

  if (method === 'GET') {
    const urlParam = data ? querystring.stringify(data) : ''

    url = appendParam(url, urlParam)
  } else if (method === 'POST') {
    const contentType = options.headers['Content-Type'] || ''
    let body

    if (contentType.indexOf('application/json') > -1) {
      body = typeof data === 'string' ? data : JSON.stringify(data)
    } else {
      body = querystring.stringify(data || {})
      options.headers['Content-Length'] = body.length
    }

    if (body) {
      options.body = body
    }
  }
  //   console.log(options.headers)
  //   console.log(options.body)

  return fetch(url, options).then(rep => {
    if (rep.status == 200) {
      switch (type) {
        case 'raw':
          return rep
        case 'json':
          return rep.json()
        default:
          return rep.text()
      }
    }

    throw new HttpError(rep)
  })
}

module.exports = request
