const Vue = require('vue')
const { TextEncoder, TextDecoder } = require('util');

const crypto = require('crypto');
Vue.config.productionTip = false

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}

// Restore Node's native Uint8Array in Jest's jsdom sandbox.
// Jest creates a VM context where global.Uint8Array is sandboxed and differs
// from the native Uint8Array that Node's Buffer inherits from, causing
// `buffer instanceof Uint8Array` to return false inside the sandbox.
global.Uint8Array = Buffer.__proto__; // eslint-disable-line no-proto

process.env.depositCALL = true;
process.env.depositXRP = true;
process.env.NODE_ENV = "TESTING"
global["Window"] = undefined

Object.defineProperty(global.self, 'crypto', {
  value: {
    getRandomValues: arr => crypto.randomBytes(arr.length),
  },
});