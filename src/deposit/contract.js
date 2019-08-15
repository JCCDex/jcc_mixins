import { BigNumber } from "bignumber.js";

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
      bizInstance: null,
      stmFingateInstance: null,
      rippleFingateInstance: null,
      callFingateInstance: null,
      moacTokens: {
        SNRC: {
          contract: "0x1b9bae18532eeb8cd4316a20678a0c43f28f0ae2"
        },
        CKM: {
          contract: "0x4d206d18fd036423aa74815511904a2a40e25fb1"
        },
        FST: {
          contract: "0x4c6007cea426e543551f2cb6392e6d6768f74706"
        }
      },
      ethTokens: {
        ETH: {
          contract: "0x0000000000000000000000000000000000000000"
        },
        MOAC: {
          contract: "0xCBcE61316759D807c474441952cE41985bBC5a40"
        },
        JCC: {
          contract: "0x9BD4810a407812042F938d2f69f673843301cfa6"
        },
        EOS: {
          contract: "0x86Fa049857E0209aa7D9e616F7eb3b3B78ECfdb0"
        },
        CALL: {
          contract: "0xcE3D828Bdb96d7c6C20Ecbfd63e572dc1C8AbD32"
        },
        EKT: {
          contract: "0xBAb165dF9455AA0F2AeD1f2565520B91DDadB4c8"
        },
        DABT: {
          contract: "0x1C6890825880566dd6Ad88147E0a6acE7930b7c0"
        },
        BIZ: {
          contract: "0x399f9A95305114efAcB91d1d6C02CBe234dD36aF"
        },
        SLASH: {
          contract: "0xE222e2e3517f5AF5e3abc667adF14320C848D6dA"
        },
        GSGC: {
          contract: "0x0ec2a5ec6a976d6d4c101fb647595c9d8d21779e"
        },
        USDT: {
          contract: "0xdAC17F958D2ee523a2206206994597C13D831ec7"
        },
        HT: {
          contract: "0x6f259637dcd74c767781e37bc6133cd6a68aa161"
        }
      }
    }
  },
  methods: {
    init(coin) {
      /* istanbul ignore else  */
      if (coin === "jstm" && process.env.depositSTM) {
        /* istanbul ignore else  */
        if (this.stmFingateInstance === null) {
          import("jcc-stream-utils").then(module => {
            const StreamFingate = module.StreamFingate;
            this.stmFingateInstance = new StreamFingate({
              host: 'nodew.labs.stream',
              port: 443,
              secure: true
            });
            this.stmFingateInstance.init();
          });
        }
      } else if (coin === "jcall" && process.env.depositCALL) {
        /* istanbul ignore else  */
        if (this.callFingateInstance === null) {
          import("jcc-call-utils").then(module => {
            const CallFingate = module.CallFingate;
            this.callFingateInstance = new CallFingate("wss://s1.callchain.live:5020");
          });
        }
      } else if (coin === 'jbiz' && process.env.depositBIZ) {
        /* istanbul ignore else  */
        if (this.bizInstance === null) {
          import("jcc-bizain-utils").then(module => {
            const BizainFingate = module.BizainFingate;
            this.bizInstance = new BizainFingate('wss://bizain.net/bc/ws');
            this.bizInstance.init();
          });
        }
      } else if (coin === 'jxrp' && process.env.depositXRP) {
        /* istanbul ignore else  */
        if (this.rippleFingateInstance === null) {
          import("jcc-ripple-utils").then(module => {
            const RippleFingate = module.RippleFingate;
            this.rippleFingateInstance = new RippleFingate('wss://s1.ripple.com');
          });
        }
      }
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
        try {
          this.changeLoadingState(this.$t("message.deposit.request_balance", { name: "STM" }));
          this.stmFingateInstance.connect();
          const balance = await this.stmFingateInstance.getBalance(address);
          console.log('stream balance:', balance);
          if (new BigNumber(amount).gt(balance)) {
            return reject(new Error(this.$t('message.deposit.more_than_available_balance', { balance })));
          }
          this.changeLoadingState(this.$t("message.deposit.request_balance_success"));
          const hash = await this.stmFingateInstance.transfer(secret, destination, amount, memo);
          return resolve(hash);
        } catch (error) {
          console.log("deposit stream error:", error);
          return reject(new Error(this.$t('message.deposit.failed')));
        } finally {
          this.stmFingateInstance.disconnect();
        }
      })
    },
    depositBizain(secret, address, amount, memo) {
      return new Promise(async (resolve, reject) => {
        const destination = "bwtC9ARd3wo7Kx3gKQ49uVgcKxoAiV1iM2";
        try {
          this.changeLoadingState(this.$t("message.deposit.request_balance", { name: "BIZ" }));
          await this.bizInstance.connect();
          const balance = await this.bizInstance.balanceOf(address);
          console.log('bizain balance:', balance);
          if (new BigNumber(amount).gt(balance)) {
            return reject(new Error(this.$t('message.deposit.more_than_available_balance', { balance })));
          }
          this.changeLoadingState(this.$t("message.deposit.request_balance_success"));
          const hash = await this.bizInstance.transfer(secret, destination, amount, memo);
          return resolve(hash);
        } catch (error) {
          console.log("deposit bizain error:", error);
          return reject(new Error(this.$t('message.deposit.failed')));
        } finally {
          this.bizInstance.disconnect();
        }
      });
    },
    depositRipple(secret, address, amount, memo) {
      return new Promise(async (resolve, reject) => {
        const destination = "rMUpPikgdhmtCida2zf4CMBLrBREfCeYcy";
        const limit = 20.1;
        try {
          this.changeLoadingState(this.$t("message.deposit.request_balance", { name: "XRP" }));
          await this.rippleFingateInstance.connect();
          const balance = await this.rippleFingateInstance.getXrpBalance(address);
          console.log('xrp balance:', balance);
          if (new BigNumber(amount).gt(balance)) {
            return reject(new Error(this.$t('message.deposit.more_than_available_balance', { balance })));
          }
          if (new BigNumber(balance).minus(amount).lt(limit)) {
            return reject(new Error(this.$t("message.deposit.xrp_limit")));
          }
          this.changeLoadingState(this.$t("message.deposit.request_balance_success"));
          const hash = await this.rippleFingateInstance.transfer(secret, destination, amount, memo);
          return resolve(hash);
        } catch (error) {
          console.log("deposit ripple error:", error);
          return reject(new Error(this.$t('message.deposit.failed')));
        } finally {
          this.rippleFingateInstance.disconnect();
        }
      })
    },
    depositCall(secret, address, amount, memo) {
      return new Promise(async (resolve, reject) => {
        const destination = "cs9AWskwRmJrcMsszqC4hWeedCL5vSpexv";
        try {
          this.changeLoadingState(this.$t("message.deposit.request_balance", { name: "CALL" }));
          await this.callFingateInstance.connect();
          const balance = await this.callFingateInstance.getCallBalance(address);
          console.log('call balance:', balance);
          if (new BigNumber(amount).gt(balance)) {
            return reject(new Error(this.$t('message.deposit.more_than_available_balance', { balance })));
          }
          this.changeLoadingState(this.$t("message.deposit.request_balance_success"));
          const hash = await this.callFingateInstance.transfer(secret, destination, amount, memo);
          return resolve(hash);
        } catch (error) {
          console.log("deposit call error:", error);
          return reject(new Error(this.$t('message.deposit.failed')));
        } finally {
          this.callFingateInstance.disconnect();
        }
      })
    },
    depositMoac(secret, address, amount, memo) {
      return new Promise(async (resolve, reject) => {
        let balance = 0;
        const minLimit = 0.1;
        const scAddress = "0x66c9b619215db959ec137ede6b96f3fa6fd35a8a";
        import("jcc-moac-utils").then(async (module) => {
          this.changeLoadingState(this.$t("message.deposit.request_balance", { name: "MOAC" }));
          const Moac = module.Moac;
          const Fingate = module.Fingate;
          const moac = new Moac(this.getMoacHost(), true);
          moac.initChain3();
          const moacFingateInstance = new Fingate();
          moacFingateInstance.init(scAddress, moac);
          balance = await moac.getBalance(address);
          const isJMOAC = this.coin.toLowerCase() === "jmoac";
          console.log('moac balance:', balance);
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
            } finally {
              moacFingateInstance.destroy();
            }
          } else {
            if (new BigNumber(balance).lt(minLimit)) {
              return reject(new Error(this.$t('message.deposit.moac_limit')));
            }
            let coin = this.coin.toUpperCase().replace("J", "");
            console.log("deposit moac erc20:" + coin);
            let tokenContract = this.moacTokens[coin].contract;
            const ERC20 = module.ERC20;
            const moacErc20Instance = new ERC20();
            try {
              moacErc20Instance.init(tokenContract, moac);
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
            } finally {
              moacErc20Instance.destroy();
            }
          }
        })
      });
    },
    depositEthereum(secret, address, amount, memo) {
      return new Promise(async (resolve, reject) => {
        const scAddress = "0x3907acb4c1818adf72d965c08e0a79af16e7ffb8";
        const minLimit = 0.1;
        import("jcc-ethereum-utils").then(async (module) => {
          this.changeLoadingState(this.$t("message.deposit.request_balance", { name: "ETH" }));
          const Ethereum = module.Ethereum;
          const ethereumInstance = new Ethereum(this.getEthHost(), true);
          ethereumInstance.initWeb3();
          const Fingate = module.Fingate;
          const etherFingateInstance = new Fingate();
          etherFingateInstance.init(scAddress, ethereumInstance);
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
              const state = await etherFingateInstance.depositState(address);
              if (etherFingateInstance.isPending(state)) {
                return reject(new Error(this.$t('message.deposit.previous_deposit_not_finish')));
              }
              this.changeLoadingState(this.$t("message.deposit.request_balance_success"));
              const hash = await etherFingateInstance.deposit(secret, memo.jtaddress, amount);
              return resolve(hash);
            } catch (error) {
              console.log("deposit eth error:", error);
              return reject(new Error(this.$t('message.deposit.failed')));
            } finally {
              etherFingateInstance.destroy();
            }
          } else {
            const ERC20 = module.ERC20;
            const etherErc20Instance = new ERC20();
            try {
              if (new BigNumber(ethBalance).lt(minLimit)) {
                return reject(new Error(this.$t('message.deposit.eth_limit')));
              }
              const coin = this.coin.toUpperCase().replace("J", "");
              const tokenContract = this.ethTokens[coin].contract;
              etherErc20Instance.init(tokenContract, ethereumInstance);
              const state = await etherFingateInstance.depositState(address, tokenContract);
              if (etherFingateInstance.isPending(state)) {
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
                  depositTokenHash = await etherFingateInstance.depositToken(memo.jtaddress, tokenContract, decimals, amount, transferHash, secret)
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
            } finally {
              etherErc20Instance.destroy();
            }
          }
        })
      })
    }
  }
}