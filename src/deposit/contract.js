import BigNumber from "bignumber.js";
import fingateInstance from "./instance";

const getEthHost = (hosts) => {
  /* istanbul ignore if  */
  if (!Array.isArray(hosts) || hosts.length === 0) {
    hosts = process.env.ethHosts;
  }
  let host = hosts[Math.floor(Math.random() * hosts.length)];
  let url = `https://${host}`;
  return url;
}

const getMoacHost = (hosts) => {
  /* istanbul ignore if  */
  if (!Array.isArray(hosts) || hosts.length === 0) {
    hosts = process.env.moacHosts;
  }
  let host = hosts[Math.floor(Math.random() * hosts.length)];
  let url = `https://${host}`;
  return url;
}

export default {
  data() {
    return {
      currentOrder: null,
      moacTokens: {
        JSNRC: {
          contract: "0x1b9bae18532eeb8cd4316a20678a0c43f28f0ae2"
        },
        JCKM: {
          contract: "0x4d206d18fd036423aa74815511904a2a40e25fb1"
        },
        JFST: {
          contract: "0x4c6007cea426e543551f2cb6392e6d6768f74706"
        }
      },
      ethTokens: {
        JETH: {
          contract: "0x0000000000000000000000000000000000000000"
        },
        JMOAC: {
          contract: "0xCBcE61316759D807c474441952cE41985bBC5a40"
        },
        JJCC: {
          contract: "0x9BD4810a407812042F938d2f69f673843301cfa6"
        },
        JEOS: {
          contract: "0x86Fa049857E0209aa7D9e616F7eb3b3B78ECfdb0"
        },
        JCALL: {
          contract: "0xcE3D828Bdb96d7c6C20Ecbfd63e572dc1C8AbD32"
        },
        JEKT: {
          contract: "0xBAb165dF9455AA0F2AeD1f2565520B91DDadB4c8"
        },
        JDABT: {
          contract: "0x1C6890825880566dd6Ad88147E0a6acE7930b7c0"
        },
        JBIZ: {
          contract: "0x399f9A95305114efAcB91d1d6C02CBe234dD36aF"
        },
        JSLASH: {
          contract: "0xE222e2e3517f5AF5e3abc667adF14320C848D6dA"
        },
        JGSGC: {
          contract: "0x0ec2a5ec6a976d6d4c101fb647595c9d8d21779e"
        },
        JUSDT: {
          contract: "0xdAC17F958D2ee523a2206206994597C13D831ec7"
        },
        JHT: {
          contract: "0x6f259637dcd74c767781e37bc6133cd6a68aa161"
        }
      }
    }
  },
  methods: {
    init(coin) {
      console.log("deposit coin: " + coin);
    },
    initData(coin) {
      this.init(coin);
    },
    getEthHost() {
      let ethHosts = this.$store.getters.hosts.ethHosts;
      let host = getEthHost(ethHosts);
      return host;
    },
    getMoacHost() {
      let ethHosts = this.$store.getters.hosts.moacHosts;
      let host = getMoacHost(ethHosts);
      return host;
    },
    depositStream(secret, address, amount, memo) {
      return new Promise(async (resolve, reject) => {
        const destination = "vn4K541zh3vNHHJJaos2Poc4z3RiMHLHcK";
        let stmFingateInstance
        try {
          this.changeLoadingState(this.$t("message.deposit.request_balance", { name: "STM" }));
          const instance = await fingateInstance.init("stream");
          stmFingateInstance = instance.stmFingateInstance;
          stmFingateInstance.connect();
          const balance = await stmFingateInstance.getBalance(address);
          console.log('stream balance:', balance);
          if (new BigNumber(amount).gt(balance)) {
            return reject(new Error(this.$t('message.deposit.more_than_available_balance', { balance })));
          }
          this.changeLoadingState(this.$t("message.deposit.request_balance_success"));
          const hash = await stmFingateInstance.transfer(secret, destination, amount, memo);
          return resolve(hash);
        } catch (error) {
          console.log("deposit stream error:", error);
          return reject(new Error(this.$t('message.deposit.failed')));
        } finally {
          stmFingateInstance.disconnect();
        }
      })
    },
    depositBizain(secret, address, amount, memo) {
      return new Promise(async (resolve, reject) => {
        const destination = "bwtC9ARd3wo7Kx3gKQ49uVgcKxoAiV1iM2";
        let bizInstance;
        try {
          this.changeLoadingState(this.$t("message.deposit.request_balance", { name: "BIZ" }));
          const instance = await fingateInstance.init("bizain");
          bizInstance = instance.bizainFingateInstance;
          await bizInstance.connect();
          const balance = await bizInstance.balanceOf(address);
          console.log('bizain balance:', balance);
          if (new BigNumber(amount).gt(balance)) {
            return reject(new Error(this.$t('message.deposit.more_than_available_balance', { balance })));
          }
          this.changeLoadingState(this.$t("message.deposit.request_balance_success"));
          const hash = await bizInstance.transfer(secret, destination, amount, memo);
          return resolve(hash);
        } catch (error) {
          console.log("deposit bizain error:", error);
          return reject(new Error(this.$t('message.deposit.failed')));
        } finally {
          bizInstance.disconnect();
        }
      });
    },
    depositRipple(secret, address, amount, memo) {
      return new Promise(async (resolve, reject) => {
        const destination = "rMUpPikgdhmtCida2zf4CMBLrBREfCeYcy";
        const limit = 20.1;
        let rippleFingateInstance;
        try {
          this.changeLoadingState(this.$t("message.deposit.request_balance", { name: "XRP" }));
          const instance = await fingateInstance.init("ripple");
          rippleFingateInstance = instance.rippleFingateInstance;
          await rippleFingateInstance.connect();
          const balance = await rippleFingateInstance.getXrpBalance(address);
          console.log('xrp balance:', balance);
          if (new BigNumber(amount).gt(balance)) {
            return reject(new Error(this.$t('message.deposit.more_than_available_balance', { balance })));
          }
          if (new BigNumber(balance).minus(amount).lt(limit)) {
            return reject(new Error(this.$t("message.deposit.xrp_limit")));
          }
          this.changeLoadingState(this.$t("message.deposit.request_balance_success"));
          const hash = await rippleFingateInstance.transfer(secret, destination, amount, memo);
          return resolve(hash);
        } catch (error) {
          console.log("deposit ripple error:", error);
          return reject(new Error(this.$t('message.deposit.failed')));
        } finally {
          rippleFingateInstance.disconnect();
        }
      })
    },
    depositCall(secret, address, amount, memo) {
      return new Promise(async (resolve, reject) => {
        const destination = "cs9AWskwRmJrcMsszqC4hWeedCL5vSpexv";
        let callFingateInstance;
        try {
          this.changeLoadingState(this.$t("message.deposit.request_balance", { name: "CALL" }));
          const instance = await fingateInstance.init("call");
          callFingateInstance = instance.callFingateInstance;
          await callFingateInstance.connect();
          const balance = await callFingateInstance.getCallBalance(address);
          console.log('call balance:', balance);
          if (new BigNumber(amount).gt(balance)) {
            return reject(new Error(this.$t('message.deposit.more_than_available_balance', { balance })));
          }
          this.changeLoadingState(this.$t("message.deposit.request_balance_success"));
          const hash = await callFingateInstance.transfer(secret, destination, amount, memo);
          return resolve(hash);
        } catch (error) {
          console.log("deposit call error:", error);
          return reject(new Error(this.$t('message.deposit.failed')));
        } finally {
          callFingateInstance.disconnect();
        }
      })
    },
    depositMoac(secret, address, amount, memo) {
      return new Promise(async (resolve, reject) => {
        const minLimit = 0.1;
        const scAddress = "0x66c9b619215db959ec137ede6b96f3fa6fd35a8a";

        this.changeLoadingState(this.$t("message.deposit.request_balance", { name: "MOAC" }));

        const instance = await fingateInstance.initWithContract("moac", this.getMoacHost(), scAddress)
        const { moacInstance, moacFingateInstance } = instance;
        const balance = await moacInstance.getBalance(address);
        console.log('moac balance:', balance);
        const isJMOAC = this.coin.toLowerCase() === "jmoac";
        if (isJMOAC) {
          try {
            if (new BigNumber(amount).gt(balance)) {
              return reject(new Error(this.$t('message.deposit.more_than_available_balance', { balance })));
            }
            if (new BigNumber(balance).minus(minLimit).lt(amount)) {
              return reject(new Error(this.$t('message.deposit.moac_limit')));
            }
            const state = await moacFingateInstance.depositState(address);
            if (moacFingateInstance.isPending(state)) {
              return reject(new Error(this.$t('message.deposit.previous_deposit_not_finish')));
            }
            this.changeLoadingState(this.$t("message.deposit.request_balance_success"));
            const hash = await moacFingateInstance.deposit(memo.jtaddress, amount, secret);
            return resolve(hash);
          } catch (error) {
            console.log("deposit moac error:", error);
            return reject(new Error(this.$t('message.deposit.failed')));
          }
        } else {
          if (new BigNumber(balance).lt(minLimit)) {
            return reject(new Error(this.$t('message.deposit.moac_limit')));
          }
          let coin = this.coin.toUpperCase();
          console.log("deposit moac erc20:" + coin);
          let tokenContract = this.moacTokens[coin].contract;
          try {
            const instance = await fingateInstance.initWithContract("moac", this.getMoacHost(), scAddress, tokenContract);
            const moacErc20Instance = instance.moacERC20Instance;
            const state = await moacFingateInstance.depositState(address, tokenContract);
            if (moacFingateInstance.isPending(state)) {
              return reject(new Error(this.$t('message.deposit.previous_deposit_not_finish')));
            }
            let tokenBalance = await moacErc20Instance.balanceOf(address);
            console.log(coin + " balance:", tokenBalance);
            if (new BigNumber(amount).gt(tokenBalance)) {
              return reject(new Error(this.$t('message.deposit.more_than_available_balance', { balance: tokenBalance })));
            }
            this.changeLoadingState(this.$t("message.deposit.request_balance_success"));
            let hash = await moacErc20Instance.transfer(secret, scAddress, amount);
            let depositTokenHash = null;
            while (depositTokenHash === null) {
              try {
                depositTokenHash = await moacFingateInstance.depositToken(memo.jtaddress, tokenContract, moacErc20Instance.decimals(), amount, hash, secret);
              } catch (error) {
                console.log("deposit token error:", error);
              }
            }
            /* istanbul ignore else  */
            if (depositTokenHash) {
              return resolve(depositTokenHash);
            }
          } catch (error) {
            console.log("deposit moac erc20 error:", error);
            return reject(new Error(this.$t('message.deposit.failed')));
          }
        }
      });
    },
    depositEthereum(secret, address, amount, memo) {
      return new Promise(async (resolve, reject) => {
        const scAddress = "0x3907acb4c1818adf72d965c08e0a79af16e7ffb8";
        const minLimit = 0.1;
        this.changeLoadingState(this.$t("message.deposit.request_balance", { name: "ETH" }));
        const instance = await fingateInstance.initWithContract("ethereum", this.getEthHost(), scAddress)
        const { ethereumInstance, ethereumFingateInstance } = instance;
        let ethBalance = await ethereumInstance.getBalance(address);
        const isJETH = this.coin.toUpperCase() === "JETH";
        if (isJETH) {
          try {
            if (new BigNumber(amount).gt(ethBalance)) {
              return reject(new Error(this.$t('message.deposit.more_than_available_balance', { balance: ethBalance })));
            }
            if (new BigNumber(ethBalance).minus(minLimit).lt(amount)) {
              return reject(new Error(this.$t('message.deposit.eth_limit')));
            }
            const state = await ethereumFingateInstance.depositState(address);
            if (ethereumFingateInstance.isPending(state)) {
              return reject(new Error(this.$t('message.deposit.previous_deposit_not_finish')));
            }
            this.changeLoadingState(this.$t("message.deposit.request_balance_success"));
            const hash = await ethereumFingateInstance.deposit(secret, memo.jtaddress, amount);
            return resolve(hash);
          } catch (error) {
            console.log("deposit eth error:", error);
            return reject(new Error(this.$t('message.deposit.failed')));
          }
        } else {
          try {
            if (new BigNumber(ethBalance).lt(minLimit)) {
              return reject(new Error(this.$t('message.deposit.eth_limit')));
            }
            const coin = this.coin.toUpperCase();
            const tokenContract = this.ethTokens[coin].contract;
            const instance = await fingateInstance.initWithContract("ethereum", this.getEthHost(), scAddress, tokenContract);
            const etherErc20Instance = instance.ethereumERC20Instance;
            const state = await ethereumFingateInstance.depositState(address, tokenContract);
            if (ethereumFingateInstance.isPending(state)) {
              return reject(new Error(this.$t('message.deposit.previous_deposit_not_finish')));
            }
            const balance = await etherErc20Instance.balanceOf(address);
            console.log(coin + " balance:", balance);
            if (new BigNumber(amount).gt(balance)) {
              return reject(new Error(this.$t('message.deposit.more_than_available_balance', { balance: balance })));
            }
            this.changeLoadingState(this.$t("message.deposit.request_balance_success"));
            const decimals = await etherErc20Instance.decimals();
            const transferHash = await etherErc20Instance.transfer(secret, scAddress, amount);
            let depositTokenHash = null;
            while (depositTokenHash === null) {
              try {
                depositTokenHash = await ethereumFingateInstance.depositToken(memo.jtaddress, tokenContract, decimals, amount, transferHash, secret)
              } catch (error) {
                console.log("deposit token error:", error);
              }
            }
            /* istanbul ignore else  */
            if (depositTokenHash) {
              return resolve(depositTokenHash);
            }
          } catch (error) {
            console.log("deposit ethereum erc20 error:", error);
            return reject(new Error(this.$t('message.deposit.failed')));
          }
        }
      })
    }
  }
}