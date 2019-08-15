const testJingchangWallet = {
  "version": "1.0",
  "id": "4085118690b6b24a58e8b9a2e26a15a31f2dfbd9e6280752a04af70e3a5389cc",
  "contact": {},
  "wallets": [{
    "ciphertext": "967b561d8718fb5cbf33a719d6ad5e0fbf2c6a0eacaa96d8f56df0d342",
    "crypto": {
      "cipher": "aes-128-ctr",
      "iv": "6955fe1dc33bfa4d3613736e42d51911",
      "kdf": "scrypt",
      "kdfparams": {
        "dklen": 32,
        "n": 4096,
        "p": 1,
        "r": 8,
        "salt": "8a3a28bb8a3161726fceb7a78916217bb447b42f66d1b2e37c12bc7cc8f4af19"
      }
    },
    "mac": "5b31f8510a58b233b4052002186506ce8be61d74f2cce6f2774e267fba35d6de",
    "type": "swt",
    "address": "j4v9vGszgKaLKrqcNsKsr1ZE2wJYQmvbNm",
    "default": true,
    "alias": ""
  }, {
    "ciphertext": "9d55c8798d783a6652194ccfc803e5c28b3cf52d672e69a66486581043",
    "crypto": {
      "cipher": "aes-128-ctr",
      "iv": "da19758a4105b467262f3933a758e291",
      "kdf": "scrypt",
      "kdfparams": {
        "dklen": 32,
        "n": 4096,
        "p": 1,
        "r": 8,
        "salt": "009228ccd2abf93ab8208eeb695e721d962f2124285547df7c42ff73eee86135"
      }
    },
    "mac": "12f3706a7e98a958376537b790e1760d5b6ef819810a807d48a6199c8e10f248",
    "type": "xrp",
    "address": "rJAHXtShZYuXpCNa3EeGq4LJmYi1BT5aHo",
    "default": true,
    "alias": "xrp wallet"
  }, {
    "ciphertext": "0cf6e94bc66e895df065ce606005b1f66802cdbb046ed0c2e3eff8868196c7af59ff436d88ca00aa15f350423b3a95dd40bd86a5acadb51545c7e7875273283d",
    "crypto": {
      "cipher": "aes-128-ctr",
      "iv": "d99be2afed7e453cfe4e2439080ee979",
      "kdf": "scrypt",
      "kdfparams": {
        "dklen": 32,
        "n": 4096,
        "p": 1,
        "r": 8,
        "salt": "5b4fc3428241b24ab0b5061c2a84e89994e4b5e8d321059c82db56a07d597813"
      }
    },
    "mac": "d207d5c9f340533fb7587913374bbf28dab4b887e413da741771da0f78352a8b",
    "type": "eth",
    "address": "0x2995c1376a852e4040caf9dbae2c765e24c37a15",
    "default": true,
    "alias": "eth wallet"
  }, {
    "ciphertext": "e3458d537a2260b78e7eeeb7ba3ea7583799d74ac017ad2dbd5769e033e53f31d7634b9d1f115007783bec1a7a1dce2e922731dedcc2cd76413ee98f149f9ac4",
    "crypto": {
      "cipher": "aes-128-ctr",
      "iv": "7a8418bfb28713aa8978df12e7db79a0",
      "kdf": "scrypt",
      "kdfparams": {
        "dklen": 32,
        "n": 4096,
        "p": 1,
        "r": 8,
        "salt": "20e538e806fc4c97e55322ce4ac25b0cc80abf8f1e2b82e101113c738e240b6d"
      }
    },
    "mac": "0d3a88be6f88cd42cd17eaaf1b39b002187049763baa21e1c2134fcdeb36d476",
    "type": "moac",
    "address": "0x5edccedfe9952f5b828937b325bd1f132aa09f60",
    "default": true,
    "alias": "moac wallet"
  }]
}

const testPassword = "12345678Abc";

const testBalance = { "balance_swt": "2108.75396300", "freezed_swt": "160.00000000", "balance_jusdt": "--", "freezed_jusdt": "--", "balance_jmoac": "1.00600000", "freezed_jmoac": "0.00000000", "balance_jeth": "0.02100000", "freezed_jeth": "0.00000000", "balance_jxrp": "1.01000000", "freezed_jxrp": "0.00000000", "balance_jfst": "1.00000000", "freezed_jfst": "0.00000000", "balance_jbiz": "12.32000000", "freezed_jbiz": "0.00000000", "balance_jht": "--", "freezed_jht": "--", "balance_cny": "0.05554923", "freezed_cny": "0.00000000", "balance_jjcc": "6.21000000", "freezed_jjcc": "0.00000000", "balance_csp": "--", "freezed_csp": "--", "balance_jstm": "21.30000000", "freezed_jstm": "0.00000000", "balance_vcc": "0.00000000", "freezed_vcc": "0.00000000", "balance_jcall": "3.40000000", "freezed_jcall": "0.00000000", "balance_jslash": "0.00000000", "freezed_jslash": "0.00000000", "balance_jgsgc": "--", "freezed_jgsgc": "--", "balance_jdabt": "0.00000000", "freezed_jdabt": "0.00000000", "balance_hjt": "0.00000000", "freezed_hjt": "0.00000000", "balance_myt": "0.00000000", "freezed_myt": "0.00000000", "balance_jekt": "0.00000000", "freezed_jekt": "0.00000000", "balance_bic": "0.00000000", "freezed_bic": "0.00000000", "balance_yut": "0.00000000", "freezed_yut": "0.00000000", "balance_jckm": "0.01300000", "freezed_jckm": "0.00000000", "balance_ust": "0.00000000", "freezed_ust": "0.00000000", "balance_ecp": "0.00000000", "freezed_ecp": "0.00000000", "balance_jbtc": "0.00000000", "freezed_jbtc": "0.00000000", "balance_jsec": "6.88888889", "freezed_jsec": "0.00000000", "balance_jsect": "0.01421640", "freezed_jsect": "0.00000000", "balance_swtc": "0.00000000", "freezed_swtc": "0.00000000", "balance_jcbct": "0.00000000", "freezed_jcbct": "0.00000000", "balance_jrtx": "0.00000000", "freezed_jrtx": "0.00000000", "balance_jsnrc": "4.14000000", "freezed_jsnrc": "0.00000000", "balance_jckt": "0.10000000", "freezed_jckt": "0.00000000" }

const testCoins = [{ "value": "SWT", "label": "SWTC", "deposit": false, "withdraw": false, "smartContract": false, "effectiveTime": { "startTime": "07/01/2019 12:43:00", "endTime": "0" } }, { "value": "CNY", "label": "CNT", "deposit": false, "withdraw": false, "smartContract": false, "effectiveTime": { "startTime": "0", "endTime": "0" } }, { "value": "JJCC", "label": "JCC", "deposit": true, "withdraw": true, "isBase": true, "smartContract": true, "integerBit": 8, "decimalBit": 2, "effectiveTime": { "startTime": "0", "endTime": "0" } }, { "value": "JUSDT", "label": "USDT", "deposit": true, "withdraw": true, "smartContract": true, "isBase": true, "integerBit": 8, "decimalBit": 2, "effectiveTime": { "startTime": "0", "endTime": "0" } }, { "value": "JMOAC", "label": "MOAC", "deposit": true, "withdraw": true, "isBase": true, "smartContract": true, "integerBit": 8, "decimalBit": 2, "effectiveTime": { "startTime": "0", "endTime": "0" } }, { "value": "JETH", "label": "ETH", "deposit": true, "withdraw": true, "isBase": false, "smartContract": true, "integerBit": 8, "decimalBit": 2, "effectiveTime": { "startTime": "0", "endTime": "0" } }, { "value": "JXRP", "label": "XRP", "deposit": true, "withdraw": true, "isBase": true, "smartContract": true, "integerBit": 10, "decimalBit": 2, "effectiveTime": { "startTime": "0", "endTime": "0" } }, { "value": "JHT", "label": "HT", "deposit": true, "withdraw": true, "isBase": true, "smartContract": true, "integerBit": 8, "decimalBit": 2, "effectiveTime": { "startTime": "07/20/2019 10:00:00", "endTime": "0" } }, { "value": "BIC", "label": "BIC", "deposit": false, "withdraw": false, "isBase": true, "effectiveTime": { "startTime": "0", "endTime": "0" } }, { "value": "JBIZ", "label": "BIZ", "deposit": { "eth": true, "biz": true }, "withdraw": { "eth": true, "biz": true }, "isBase": true, "smartContract": true, "integerBit": 8, "decimalBit": 2, "effectiveTime": { "startTime": "0", "endTime": "0" } }, { "value": "JCALL", "label": "CALL", "deposit": true, "withdraw": true, "isBase": true, "smartContract": true, "integerBit": 8, "decimalBit": 2, "effectiveTime": { "startTime": "0", "endTime": "0" } }, { "value": "JCKM", "label": "CKM", "deposit": true, "withdraw": true, "isBase": true, "smartContract": true, "integerBit": 8, "decimalBit": 2, "effectiveTime": { "startTime": "0", "endTime": "0" } }, { "value": "CSP", "label": "CSPC", "deposit": false, "withdraw": false, "isBase": true, "smartContract": false, "effectiveTime": { "startTime": "0", "endTime": "0" } }, { "value": "JDABT", "label": "DABT", "deposit": true, "withdraw": true, "isBase": true, "smartContract": true, "integerBit": 8, "decimalBit": 2, "effectiveTime": { "startTime": "0", "endTime": "0" } }, { "value": "ECP", "label": "ECP", "deposit": false, "withdraw": false, "isBase": true, "smartContract": false, "effectiveTime": { "startTime": "0", "endTime": "0" } }, { "value": "EGP", "label": "EGP", "deposit": false, "withdraw": false, "isBase": true, "smartContract": false, "effectiveTime": { "startTime": "0", "endTime": "0" } }, { "value": "JEKT", "label": "EKT", "deposit": true, "withdraw": true, "isBase": true, "smartContract": true, "integerBit": 8, "decimalBit": 2, "effectiveTime": { "startTime": "0", "endTime": "0" } }, { "value": "JFST", "label": "FST", "deposit": true, "withdraw": true, "smartContract": true, "isBase": true, "integerBit": 8, "decimalBit": 2, "effectiveTime": { "startTime": "0", "endTime": "0" } }, { "value": "JGSGC", "label": "GSGC", "deposit": true, "withdraw": true, "smartContract": true, "isBase": true, "integerBit": 8, "decimalBit": 2, "effectiveTime": { "startTime": "0", "endTime": "0" } }, { "value": "HJT", "label": "HJT", "deposit": false, "withdraw": false, "isBase": true, "effectiveTime": { "startTime": "0", "endTime": "0" } }, { "value": "MYT", "label": "MYT", "deposit": false, "withdraw": false, "isBase": true, "effectiveTime": { "startTime": "0", "endTime": "0" } }, { "value": "JSLASH", "label": "SLASH", "deposit": true, "withdraw": true, "smartContract": true, "isBase": true, "integerBit": 8, "decimalBit": 2, "effectiveTime": { "startTime": "0", "endTime": "0" } }, { "value": "JSNRC", "label": "SNRC", "deposit": true, "withdraw": true, "isBase": true, "smartContract": true, "integerBit": 8, "decimalBit": 2, "effectiveTime": { "startTime": "0", "endTime": "0" } }, { "value": "SPC", "label": "SPC", "deposit": false, "withdraw": false, "isBase": true, "smartContract": false, "effectiveTime": { "startTime": "0", "endTime": "0" } }, { "value": "JSTM", "label": "STM", "deposit": true, "withdraw": true, "isBase": true, "integerBit": 8, "decimalBit": 2, "effectiveTime": { "startTime": "0", "endTime": "0" } }, { "value": "UST", "label": "UST", "deposit": false, "withdraw": false, "smartContract": false, "effectiveTime": { "startTime": "0", "endTime": "0" } }, { "value": "VCC", "label": "VCC", "deposit": false, "withdraw": false, "smartContract": false, "effectiveTime": { "startTime": "0", "endTime": "0" } }, { "value": "YUT", "label": "YUT", "deposit": false, "withdraw": false, "isBase": true, "smartContract": false, "effectiveTime": { "startTime": "07/04/2019 14:30:00", "endTime": "0" } }]

const testTxPairs = [{
  "dealArea": "USDT",
  "base": "JMOAC",
  "baseTitle": "MOAC",
  "counter": "JUSDT",
  "counterTitle": "USDT",
  "minAmount": 1,
  "priceDecimal": 4,
  "priceDecimals": { "default": 4, "decimals": [1, 2, 3, 4] },
  "amountDecimal": 0,
  "bidLimitDecimal": 4,
  "isInteger": true,
  "effectiveTime": { "startTime": "0", "endTime": "0" }
}]

const testHash = "14196A21E847FDF6EE35F7624D4A6A318F933D526BA4B373A75B707DB255487B"

const testSwtSecret = "san6tyvQCyTAPcqEQ5b91AJ7ucSat"
const testSwtAddress = "j4v9vGszgKaLKrqcNsKsr1ZE2wJYQmvbNm"

const testMemo = {
  jtaddress: testSwtAddress
}

const testRippleSecret = "shSVtBorCqhmUAEcugSX4oa4Hd325"
const testRippleAddress = "rJAHXtShZYuXpCNa3EeGq4LJmYi1BT5aHo"

const testCallSecret = "sp66zf6eSUmUF2EpYgm5vyrPKEyGU";
const testCallAddress = "cHwjX2t16UvZxyQmczBFaawwWnaaJbnA8h";

const testBizainSecret = "ssySqG4BhxpngV2FjAe1SJYFD4dcm";
const testBizainAddress = "bMAy4Pu8CSf5apR44HbYyLFKeC9Dbau16Q";

const testStreamSecret = "sp5KqpgwuHo3ejF5Bf9kDSJPivEYV";
const testStreamAddress = "vaFtuK2skLZUCcqHvsFk2BMKpzQmJbQsXa";

const testMoacSecret = "8fef3bc906ea19f0348cb44bca851f5459b61e32c5cae445220e2f7066db36d8";
const testMoacAddress = "0x5edccedfe9952f5b828937b325bd1f132aa09f60";

const testEthereumSecret = "ca6dbabef201dce8458f29b2290fef4cb80df3e16fef96347c3c250a883e4486";
const testEthereumAddress = "0x2995c1376a852e4040caf9dbae2c765e24c37a15";

module.exports = {
  testJingchangWallet,
  testPassword,
  testBalance,
  testCoins,
  testPassword,
  testTxPairs,
  testHash,
  testSwtSecret,
  testSwtAddress,
  testMemo,
  testRippleSecret,
  testRippleAddress,
  testCallSecret,
  testCallAddress,
  testBizainSecret,
  testBizainAddress,
  testStreamSecret,
  testStreamAddress,
  testMoacSecret,
  testMoacAddress,
  testEthereumSecret,
  testEthereumAddress
}