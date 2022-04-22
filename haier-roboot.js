const Haier = require('./lib/Haier')
const HaierError = require('./haier/haierError')
module.exports = RED => {
  // phone list
  RED.nodes.registerType('haier-roboot', class {
    constructor (config) {
      const node = this
      RED.nodes.createNode(node, config)

      const haierConfig = RED.nodes.getNode(config.haier)
      const haier = new Haier(node, haierConfig)
      node.on('input', async data => {
        for (const key in config) { if (config[key] != '' && config[key] != null) { data[key] = config[key] } }
        data.payload = data.message || data.payload
        try {
          const res = await haier.aiService(data.payload)
          data.payload = res
          //   console.log(res.retInfo)
          //   console.log('-----------------------------------------------')
          node.status({ text: `提交成功:${data._msgid}` })
          node.send(data)
        } catch (err) {
          haier.cacheToken(null, 1)
          if (err instanceof HaierError) {
            node.status({ text: err.message, fill: 'red', shape: 'ring' })
          } else {
            if (err.status && err.status == 401 && err.status == 400) {
              node.status({ text: '授权信息失效, 请再试一次', fill: 'red', shape: 'ring' })
            } else {
              node.status({ text: err.message, fill: 'red', shape: 'ring' })
            }
          }
          node.warn(err)
          data.payload = err
          node.send(data)
        }
      })
    }
  })
}
