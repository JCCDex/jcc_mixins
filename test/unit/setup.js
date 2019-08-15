const Vue = require('vue')

const crypto = require('crypto');
Vue.config.productionTip = false

Object.defineProperty(global.self, 'crypto', {
  value: {
    getRandomValues: arr => crypto.randomBytes(arr.length),
  },
});