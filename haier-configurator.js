module.exports = (RED) => {
  RED.nodes.registerType('haier-configurator', class {
    constructor (config) {
      RED.nodes.createNode(this, config)
      Object.assign(this, config)
    }
  }, {
    credentials: {
      username: { type: 'text' },
      password: { type: 'password' }
    }
  })
}
