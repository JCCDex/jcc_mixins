const {
  JcWalletTool,
  jtWallet,
  jcWallet,
  callWallet,
  stmWallet,
  ethWallet,
  moacWallet
} = require("jcc_wallet");
const isEmptyObject = require('jcc_common').isEmptyObject;

module.exports = {
  computed: {
    jcWallet() {
      return this.$store.getters.jcWallet;
    },
    ethAddress() {
      return this.$store.getters.ethAddress;
    },
    stmAddress() {
      return this.$store.getters.stmAddress;
    },
    callAddress() {
      return this.$store.getters.callAddress;
    },
    swtAddress() {
      return this.$store.getters.swtAddress;
    },
    moacAddress() {
      return this.$store.getters.moacAddress;
    },
    bizAddress() {
      return this.$store.getters.bizAddress;
    },
    wallets() {
      if (isEmptyObject(this.jcWallet)) {
        return []
      }
      return this.jcWallet.wallets
    }
  },
  methods: {
    /**
     * remove wallet and clear cache according to type
     * Attention: if type is 'swt' or none, all wallets will be deleted.
     * @param {string} password trade password
     * @param {string} type  'swt/'eth'/'stm'/'call'/'moac'/'biz'
     * @returns {Promise} resolve()
     */
    removeWallet(password, type = "swt") {
      let jcTool = new JcWalletTool(this.jcWallet);
      return new Promise(async (resolve, reject) => {
        jcTool.validatePassword(password, "swt").then(() => {
          jcTool.removeWallet(type).then(newWallet => {
            this.$store.dispatch("updateJCWallet", newWallet)
          })
          return resolve();
        }).catch(error => {
          return reject(error);
        });
      });
    },

    /**
     * add or modify ETH wallet by ETH's keystore
     * @param {object} keystore  ETH's keystore
     * @param {string} jcPassword trade password
     * @param {string} ethPassword ETH's password
     * @returns {Promise} resolve(jcWallet)
     */
    importEthWalletByFile(keystore, jcPassword, ethPassword) {
      let jcTool = new JcWalletTool(this.jcWallet);
      return jcTool.importEthKeystore(keystore, jcPassword, ethPassword)
    },

    /**
     * add or modify wallets by secret except swt's Wallet
     * @param {string} secret
     * @param {string} password trade password
     * @param {string} type 'eth'/'stm'/'call'/'moac'/'biz'
     * @returns {Promise} resolve(jcWallet)
     */
    importWalletFormSecret(secret, password, type) {
      let jcTool = new JcWalletTool(this.jcWallet);
      let getAddress;
      switch (type) {
        case "moac":
          getAddress = moacWallet.getAddress;
          break;
        case "stm":
          getAddress = stmWallet.getAddress;
          break;
        case "call":
          getAddress = callWallet.getAddress;
          break;
        case "eth":
          getAddress = ethWallet.getAddress;
          break;
        case "biz":
          getAddress = this.getBizainAddress;
          break;
        default:
          throw new Error("wallet type is error")
      }
      return jcTool.importSecret(secret, password, type, getAddress)
    },
    // get native biz wallet address
    getBizainAddress(secret) {
      return jtWallet.getAddress(secret, 'bwt')
    },

    /**
     * import or modify swt wallet by secret
     * @param {string} secret
     * @param {string} tradePassword
     * @param {function} callBack
     */
    importSwtWalletFormSecret(secret, tradePassword, callBack) {
      let address = jtWallet.getAddress(secret);
      if (address === null) {
        throw new Error('secret is invalid');
      }
      let wallet = {
        address,
        secret
      }
      jcWallet.buildJCWallet(tradePassword, wallet, callBack)
    },

    /**
     * to import file of weidex for add swt wallet
     * @param {object} jcKeysotre weidex file's data
     * @param {function} callBack
     */
    importSwtWalletByFile(jcKeysotre, callBack) {
      if (!jcWallet.isValidJCKeystore(jcKeysotre)) {
        throw new Error("jcKeystore is invalid")
      }
      jcWallet.setJCWallet(JSON.parse(jcKeysotre), callBack);
    },

    /**
     * change trade password
     * @param {string} oldPassword
     * @param {string} newPassword
     * @returns {Promise} resolve(jcWallet)
     */
    modifyPassword(oldPassword, newPassword) {
      let jcTool = new JcWalletTool(this.jcWallet);
      return jcTool.changePassword(oldPassword, newPassword);
    },

    /**
     * decrypt and show Secret of some one wallet, if the trade password is valid
     * @param {string} tradePassword
     * @param {string} type 'swt'/'eth'/'call'/'stm'/'moac'/'biz'
     * @returns {Promise} resolve(secret)
     */
    decryptSecret(tradePassword, type) {
      let jcTool = new JcWalletTool(this.jcWallet);
      return jcTool.validatePassword(tradePassword, type);
    }
  }
}