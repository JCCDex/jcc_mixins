const Vue = require('vue')

const crypto = require('crypto');
Vue.config.productionTip = false

process.env.depositCALL = true;
process.env.depositSTM = true;
process.env.depositBIZ = true;
process.env.depositXRP = true;
process.env.NODE_ENV = "TESTING"
global["Window"] = undefined

Object.defineProperty(global.self, 'crypto', {
  value: {
    getRandomValues: arr => crypto.randomBytes(arr.length),
  },
});