# jcc_mixins

[![Build Status](https://travis-ci.com/JCCDex/jcc_mixins.svg?branch=master)](https://travis-ci.com/JCCDex/jcc_mixins)
[![Coverage Status](https://coveralls.io/repos/github/JCCDex/jcc_mixins/badge.svg?branch=master)](https://coveralls.io/github/JCCDex/jcc_mixins?branch=master)
[![npm version](https://badge.fury.io/js/jcc_mixins.svg)](https://badge.fury.io/js/jcc_mixins)

Vue 2 mixin library for the JCC (井畅) cross-chain exchange platform. Provides reusable mixins for wallet management, trading, market data display, and cross-chain deposits/withdrawals across Ethereum, MOAC, Ripple, Bizain, and CALL networks.

---

## Installation

```bash
npm install jcc_mixins
```

---

## Prerequisites

### Vuex Store Getters

Your Vuex store **must** expose the following getters:

| Getter | Type | Description |
|--------|------|-------------|
| `jcWallet` | `Object` | JingchangWallet encrypted keystore object |
| `transactionPairs` | `Array` | Array of trading pair config objects |
| `marketList` | `Object` | Market data keyed by exchange node |
| `coinmarketcapData` | `Array` | CoinMarketCap ticker data |
| `hosts` | `Object` | Node endpoint configuration (see below) |
| `ethAddress` | `String` | User's Ethereum address |
| `callAddress` | `String` | User's CALL address |
| `swtAddress` | `String` | User's SWT/JCC address |
| `moacAddress` | `String` | User's MOAC address |
| `bizAddress` | `String` | User's Bizain address |
| `secretTemp` | `Object` | Temporary secret cache `{ timeStamp, secret }` |

#### `hosts` object shape

```js
{
  bizHosts:  ['node1.example.com'],  // Bizain API hosts
  exHosts:   ['ex.example.com'],     // Exchange API hosts
  infoHosts: ['info.example.com'],   // Market info hosts
  cfgHosts:  ['cfg.example.com'],    // Config API hosts
  jcNodes:   ['jc.example.com'],     // JCC ledger nodes
  ethHosts:  ['eth.example.com'],    // Ethereum JSON-RPC hosts
  moacHosts: ['moac.example.com']    // MOAC JSON-RPC hosts
}
```

#### `transactionPairs` array item shape

```js
{
  base: 'SWT',
  counter: 'CNY',
  baseTitle: 'SWT',
  counterTitle: 'CNY',
  priceDecimal: 6,
  amountDecimal: 2,
  minAmount: 1,
  isInteger: false
}
```

### `process.env` Configuration

| Key | Type | Description |
|-----|------|-------------|
| `convertToCny` | `Boolean` | Whether to convert prices to CNY |
| `anchorCurrency` | `Object` | Default anchor currency `{ currency: 'USD' }` |
| `proxy` | `Boolean` | When `true`, returns empty arrays for all host getters (use with dev proxy) |
| `ethHosts` | `Array` | Fallback Ethereum hosts when store is empty |
| `moacHosts` | `Array` | Fallback MOAC hosts when store is empty |
| `bizHosts` / `exHosts` / `infoHosts` / `cfgHosts` / `jcNodes` | `Array` | Fallback node hosts |
| `bizPort` / `exPort` / `infoPort` / `cfgPort` | `Number` | Service ports (non-production only; production uses 443) |

---

## Mixins

### `jCurrency`

Provides display titles for the current trading pair's currencies.

**Requires in component data:** `base` (String), `counter` (String)

| Computed | Returns | Description |
|----------|---------|-------------|
| `pairs` | `Array` | `transactionPairs` from store |
| `counterTitle` | `String` | Display title for the counter currency |
| `baseTitle` | `String` | Display title for the base currency |

---

### `jDecimal`

Provides decimal precision config for price and amount inputs.

**Requires in component data:** `base` (String), `counter` (String)

| Method | Signature | Description |
|--------|-----------|-------------|
| `getPairConfig` | `(pairs, base, counter) → Object` | Returns `{ minAmount, isInteger, priceDecimal, amountDecimal }` for the given pair |

| Computed | Returns | Description |
|----------|---------|-------------|
| `pairs` | `Array` | `transactionPairs` from store |
| `priceDecimal` | `Number` | Number of decimal places for price input |
| `amountDecimal` | `Number` | Number of decimal places for amount input |

---

### `jNodeConfig`

Resolves API node hosts and ports from the Vuex store, with `process.env` fallbacks.

| Computed | Returns | Description |
|----------|---------|-------------|
| `bizHosts` | `Array` | Bizain service hosts |
| `exHosts` | `Array` | Exchange service hosts |
| `infoHosts` | `Array` | Market info service hosts |
| `cfgHosts` | `Array` | Config service hosts |
| `jcNodes` | `Array` | JCC ledger node hosts |
| `https` | `Boolean` | `true` in production |
| `bizPort` / `exPort` / `infoPort` / `cfgPort` | `Number` | `443` in production, else from `process.env` |

---

### `jMarketInfo`

Displays live market statistics for the current trading pair.

**Requires in component data:** `base` (String), `counter` (String)

| Computed | Returns | Description |
|----------|---------|-------------|
| `marketList` | `Object` | Raw market data from store |
| `pairData` | `Object` | Market data entry for the current pair |
| `highest` | `Number\|'--'` | 24h high price |
| `lowest` | `Number\|'--'` | 24h low price |
| `rate` | `Number` | Price change rate (0 if unavailable) |
| `ratePercent` | `String` | Formatted rate e.g. `"+1.23%"` or `"--"` |
| `price` | `Number\|'--'` | Current last price |
| `volume24` | `Number\|'--'` | 24h trading volume |

| Method | Signature | Description |
|--------|-----------|-------------|
| `isNumber` | `(value) → Boolean` | Returns `true` if value is a valid number |

---

### `jExchangeRate`

Converts currency prices using market data and CoinMarketCap tickers.

**Depends on:** `jMarketInfo` (uses `marketList`)

| Method | Signature | Description |
|--------|-----------|-------------|
| `getTicker` | `(token) → Object\|null` | Finds CoinMarketCap ticker for a token symbol |
| `tickerPrice` | `(token, currency?) → Number` | Gets token price in the anchor currency |
| `getExchangeRate` | `(counter) → Number\|'--'` | Returns CNY/USD exchange rate for a counter currency |
| `getBasePrice` | `(counter, base?) → Number\|'--'` | Market price of `base` in `counter` units |
| `getCounterPrice` | `(counter, base?) → Number\|'--'` | Inverse of `getBasePrice` |
| `setPrice` | `(price, decimal?) → String` | Formats a price with optional CNY conversion |

---

### `jExchange`

Handles buy/sell order creation. **Depends on:** `jExchangeRate`, `jCurrency`, `jDecimal`, `jNodeConfig`.

**Requires in component data/computed:** `base`, `counter`, `jcWallet`, `ind` (buy/sell indicator)

| Method | Signature | Description |
|--------|-----------|-------------|
| `limitDecimal` | `() → void` | Rounds `form.price` to `priceDecimal` places (SWT pairs only) |
| `setBasePrice` | `(highest, lowest) → void` | Sets reference prices for fat-finger detection |
| `checkFatFinger` | `(price, buy) → Boolean` | Returns `true` if price deviates >20% from reference |
| `validatePassword` | `(checked, password) → Promise` | Decrypts SWT secret and submits the order |
| `confirmSubmit` | `(secret) → Promise` | Creates a buy/sell order via `jcc_exchange` |
| `getcheckClick` | `() → void` | Resets the secret temp cache |

**Component data:**

```js
data() {
  return {
    form: { price: '', amount: '' },
    lowestSellPrice: 0,
    hightestBuyPrice: 0,
    ind: ''  // 'buy' | 'sell'
  }
}
```

---

### `jWallet`

Multi-chain wallet management via `jcc_wallet`'s `JingchangWallet`.

| Computed | Returns | Description |
|----------|---------|-------------|
| `jcWallet` | `Object` | Full JingchangWallet keystore |
| `wallets` | `Array` | Wallet entries inside the keystore |
| `ethAddress` / `callAddress` / `swtAddress` / `moacAddress` / `bizAddress` | `String` | Chain-specific addresses from store |

| Method | Signature | Returns | Description |
|--------|-----------|---------|-------------|
| `removeWallet` | `(password, type?)` | `Promise<void>` | Removes a wallet entry; `type` defaults to `'swt'` which removes all wallets |
| `importEthWalletByFile` | `(keystore, jcPassword, ethPassword)` | `Promise<Object>` | Imports ETH wallet from a keystore JSON file |
| `importWalletFormSecret` | `(secret, password, type)` | `Promise<Object>` | Imports a wallet from a raw secret for `eth`/`call`/`moac`/`biz` |
| `importSwtWalletFormSecret` | `(secret, tradePassword, callBack)` | `void` | Imports/replaces SWT wallet from secret |
| `importSwtWalletByFile` | `(jcKeystore, callBack)` | `void` | Imports SWT wallet from a Weidex keystore file |
| `modifyPassword` | `(oldPassword, newPassword)` | `Promise<Object>` | Changes master trade password for all wallets |
| `decryptSecret` | `(password, type)` | `Promise<String>` | Decrypts and returns the secret for a given wallet type |

---

### `jDepositContract`

Handles cross-chain deposits **into** the JCC platform. Requires `changeLoadingState(msg)` to be defined on the component.

**Requires in component data:** `coin` (String, the token symbol being deposited)

| Method | Signature | Returns | Description |
|--------|-----------|---------|-------------|
| `depositBizain` | `(secret, address, amount, memo)` | `Promise<String>` | Deposit BIZ tokens from Bizain chain |
| `depositRipple` | `(secret, address, amount, memo)` | `Promise<String>` | Deposit XRP; requires ≥20.1 XRP reserve remain |
| `depositCall` | `(secret, address, amount, memo)` | `Promise<String>` | Deposit CALL tokens |
| `depositMoac` | `(secret, address, amount, memo)` | `Promise<String>` | Deposit JMOAC or MOAC ERC-20 tokens |
| `depositEthereum` | `(secret, address, amount, memo)` | `Promise<String>` | Deposit JETH or Ethereum ERC-20 tokens |

**Data (auto-populated):** `moacTokens` and `ethTokens` — maps of supported token symbols to their on-chain contract addresses.

---

### `jWithdrawContract`

Handles cross-chain withdrawals **out of** the JCC platform. Depends on `jNodeConfig`. Requires `changeLoadingState(msg)`, `availableMOAC`, `availableETH`, and `eth_moac_gas` on the component.

| Method | Signature | Returns | Description |
|--------|-----------|---------|-------------|
| `serializePayment` | `(secret, to, amount, token, memo, issuer?)` | `Object` | Builds a payment data object |
| `transfer` | `(payment)` | `Promise<String>` | Submits a JCC ledger transfer; returns transaction hash |
| `withdrawCall` | `(swtSecret, callAddress, token, amount)` | `Promise<String>` | Withdraw to CALL chain |
| `withdrawBizain` | `(swtSecret, bizAddress, token, amount)` | `Promise<String>` | Withdraw to Bizain chain |
| `withdrawRipple` | `(swtSecret, rippleAddress, token, amount)` | `Promise<String>` | Withdraw to Ripple/XRP |
| `withdrawMoac` | `(swtSecret, moacAddress, token, amount)` | `Promise<String>` | Withdraw JMOAC or MOAC ERC-20 (pays gas automatically) |
| `withdrawEthereum` | `(swtSecret, ethereumAddress, token, amount)` | `Promise<String>` | Withdraw JETH or ETH ERC-20 (pays gas automatically) |

---

## Usage Examples

### Wallet import in a Vue component

```vue
<script>
import { jWallet } from 'jcc_mixins'

export default {
  mixins: [jWallet],
  methods: {
    async onImportBySecret(secret, password) {
      try {
        await this.importWalletFormSecret(secret, password, 'eth')
        // wallet saved; store updated via updateJCWallet dispatch
      } catch (e) {
        this.$message.error(e.message)
      }
    }
  }
}
</script>
```

### Deposit in a Vue component

```vue
<script>
import { jDepositContract } from 'jcc_mixins'

export default {
  mixins: [jDepositContract],
  data() {
    return { coin: 'JETH' }
  },
  methods: {
    changeLoadingState(msg) {
      this.loadingMsg = msg
    },
    async onDeposit(secret, address, amount) {
      try {
        const hash = await this.depositEthereum(secret, address, amount, {
          jtaddress: this.swtAddress
        })
        console.info('deposit tx:', hash)
      } catch (e) {
        this.$message.error(e.message)
      }
    }
  }
}
</script>
```

---

## Build & Development

```bash
# Lint source
npm run gulp

# Run tests with coverage
npm test

# Build lib/ output (ES5)
npx gulp build

# Publish to npm (bumps version, builds, publishes)
npm run deploy            # patch bump
npm run deploy -- minor   # minor bump
```

---

## License

MIT © [JCCDex](https://github.com/JCCDex)
