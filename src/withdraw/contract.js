import JCCExchange from "jcc_exchange";
import { jtWallet } from "jcc_wallet";
import BigNumber from "bignumber.js";
import * as jNodeConfig from "../node_config";
export default {
  data() {
    return {
      currentOrder: null,
      form: {
        amount: ""
      }
    }
  },
  mixins: [jNodeConfig],
  methods: {
    /* istanbul ignore next  */
    init() {
      console.log('init');
      console.log("coinConfig = ", this.coinConfig)
    },
    serializePayment(secret, to, amount, token, memo, issuer = "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or") {
      const data = {
        address: jtWallet.getAddress(secret),
        secret,
        to,
        amount,
        issuer,
        currency: token.toUpperCase(),
        memo: JSON.stringify(memo)
      }
      return data;
    },
    async transfer(payment) {
      const { address, secret, to, amount, issuer, currency, memo } = payment;
      try {
        JCCExchange.init(this.exHosts, this.exPort, this.https);
        const hash = await JCCExchange.transfer(address, secret, amount, memo, to, currency, issuer);
        console.log("payment hash: ", hash);
        return hash;
      } catch (error) {
        console.log("payment error: ", error);
        throw new Error(this.$t("message.withdraw.failed"));
      }
    },
    async withdrawStream(swtSecret, stmAddress, token, amount) {
      const memo = {
        stm_wallet: stmAddress,
        value: amount
      };
      const to = "japp9xxt2VHpRwHsoa76GWoQj1VdsjcZQJ";
      const data = this.serializePayment(swtSecret, to, amount, token, memo);
      try {
        const hash = await this.transfer(data);
        return hash;
      } catch (error) {
        throw error;
      }
    },
    async withdrawCall(swtSecret, callAddress, token, amount) {
      const memo = {
        call_wallet: callAddress,
        value: amount
      };
      const to = "jMCJrXRmycsT5tsVuge7Y65v9MrQi9r11E";
      const data = this.serializePayment(swtSecret, to, amount, token, memo);
      try {
        const hash = await this.transfer(data);
        return hash;
      } catch (error) {
        throw error;
      }
    },
    async withdrawBizain(swtSecret, bizAddress, token, amount) {
      const memo = {
        biz_wallet: bizAddress,
        value: amount,
        chain: "BIZ"
      };
      const to = "jDu7umDxKxeaHoj7eNdUn8YsGWTHZSuEGL";
      const data = this.serializePayment(swtSecret, to, amount, token, memo);
      try {
        const hash = await this.transfer(data);
        return hash;
      } catch (error) {
        throw error;
      }
    },
    async withdrawRipple(swtSecret, rippleAddress, token, amount) {
      const memo = {
        xrp_wallet: rippleAddress,
        value: amount,
        chain: "XRP"
      };
      const to = "jQs5cAcZrKmyWSQgkmUtXsdeFMzwSYcBA4";
      const data = this.serializePayment(swtSecret, to, amount, token, memo);
      try {
        const hash = await this.transfer(data);
        return hash;
      } catch (error) {
        throw error;
      }
    },
    withdrawMoac(swtSecret, moacAddress, token, amount) {
      return new Promise(async (resolve, reject) => {
        const moacGas = this.eth_moac_gas;
        const isJMOAC = token.toLowerCase() === "jmoac";
        if (!isJMOAC && new BigNumber(this.availableMOAC).lt(moacGas)) {
          return reject(new Error(this.$t('message.withdraw.less_than_gas_limit')));
        }
        this.changeLoadingState(this.$t("message.withdraw.request_transfer_hash"));

        if (!moacAddress.startsWith('0x')) {
          moacAddress = '0x' + moacAddress;
        }
        const memo = {
          moac_wallet: moacAddress,
          value: amount
        };
        const to = "jG9ntUTuBKqDURPUqbGYZRuRDVzPY6bpxL";
        const data = this.serializePayment(swtSecret, to, amount, token, memo);
        let hash;
        try {
          hash = await this.transfer(data);
        } catch (error) {
          return reject(error);
        }
        if (isJMOAC) {
          return resolve(hash);
        }
        // pay gas if token is erc20
        this.changeLoadingState(this.$t("message.withdraw.transfering_gas"));

        const gasMemo = {
          moac_wallet: moacAddress,
          value: moacGas,
          relate: hash
        }
        setTimeout(async () => {
          try {
            await this.payGas(swtSecret, to, moacGas, "jmoac", gasMemo);
            return resolve(hash);
          } catch (error) {
            return reject(error);
          }
        }, /* istanbul ignore next  */ process.env.NODE_ENV === "TESTING" ? 0 : 12000);
      });
    },
    withdrawEthereum(swtSecret, ethereumAddress, token, amount) {
      return new Promise(async (resolve, reject) => {
        const ethGas = this.eth_moac_gas;
        const isJETH = token.toLowerCase() === "jeth";
        if (!isJETH && new BigNumber(this.availableETH).lt(ethGas)) {
          return reject(new Error(this.$t('message.withdraw.less_than_gas_limit')));
        }
        this.changeLoadingState(this.$t("message.withdraw.request_transfer_hash"));

        const memo = {
          eth_wallet: ethereumAddress,
          value: amount
        };
        if (token.toLowerCase() === "jbiz") {
          memo.chain = "ETH";
        }
        const to = "jsk45ksJZUB7durZrLt5e86Eu2gtiXNRN4";
        const data = this.serializePayment(swtSecret, to, amount, token, memo);

        let hash;
        try {
          hash = await this.transfer(data);
        } catch (error) {
          return reject(error);
        }
        if (isJETH) {
          return resolve(hash);
        }
        // pay gas if token is erc20
        this.changeLoadingState(this.$t("message.withdraw.transfering_gas"));

        const gasMemo = {
          eth_wallet: ethereumAddress,
          value: ethGas,
          relate: hash
        }
        setTimeout(async () => {
          try {
            await this.payGas(swtSecret, to, ethGas, "jeth", gasMemo);
            return resolve(hash);
          } catch (error) {
            return reject(error);
          }
        }, /* istanbul ignore next  */ process.env.NODE_ENV === "TESTING" ? 0 : 12000);
      });
    },
    // for erc20
    async payGas(swtSecret, to, gas, token, memo) {
      const gasData = this.serializePayment(swtSecret, to, gas, token, memo);
      let gasHash = null;
      let count = 0;
      while (gasHash === null) {
        // try 10
        if (count >= 10) {
          break;
        }
        try {
          gasHash = await this.transfer(gasData);
        } catch (error) {
          console.log("transfer gas error:", error);
        } finally {
          count = count + 1;
        }
      }
      if (!gasHash) {
        throw new Error(this.$t("message.withdraw.failed"));
      }
      return gasHash;
    }
  }
}