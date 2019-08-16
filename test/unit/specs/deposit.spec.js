import Deposit from '../component/deposit.vue';
import VueI18n from 'vue-i18n';
import Vuex from "vuex";
import { mount, createLocalVue } from '@vue/test-utils';
import fingateInstance from "@/src/deposit/instance";
const sinon = require("sinon");
const sandbox = sinon.createSandbox();
const localVue = createLocalVue();
localVue.use(VueI18n);
localVue.use(Vuex);
const messages = {
  zh: {
    message: require('../i18n/zh-CN')
  }
};
const i18n = new VueI18n({
  locale: 'zh',
  messages
});

const testConfig = require("../config");

const getters = {
  hosts() {
    return {
      ethHosts: ["localhost"],
      moacHosts: ["localhost"]
    }
  }
}

const store = new Vuex.Store({
  getters
});
describe('Deposit', () => {
  const wrapper = mount(Deposit, {
    localVue,
    i18n,
    stubs: {
      transition: false
    },
    sync: false,
    store,
    methods: {
      changeLoadingState(message) {

      }
    },
    data() {
      return {
        coin: ""
      }
    }
  });
  const vm = wrapper.vm;

  const amount = "1";
  const memo = testConfig.testMemo;

  describe("test deposit api", function() {


    describe("test tokens", function() {
      it("check token contract", function() {
        expect(vm.ethTokens).toEqual({
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
        })
        expect(vm.moacTokens).toEqual({
          JSNRC: {
            contract: "0x1b9bae18532eeb8cd4316a20678a0c43f28f0ae2"
          },
          JCKM: {
            contract: "0x4d206d18fd036423aa74815511904a2a40e25fb1"
          },
          JFST: {
            contract: "0x4c6007cea426e543551f2cb6392e6d6768f74706"
          }
        })
      })
    })

    describe("test getMoacHost", function() {
      it("if the input hosts is not empty", function() {
        expect(vm.getMoacHost()).toBe("https://localhost")
      })
    })

    describe("test getEthHost", function() {
      it("if the input hosts is not empty", function() {
        expect(vm.getEthHost()).toBe("https://localhost")
      })
    })

    describe("test depositCall api", function() {
      const Fingate = require('jcc-call-utils').CallFingate;
      const secret = testConfig.testCallSecret;
      const address = testConfig.testCallAddress;
      vm.initData("jcall");

      afterEach(() => {
        sandbox.restore();
        fingateInstance.destroy();
      });

      it("depositCall shoude be a function", function() {
        expect(typeof vm.depositCall).toBe("function");
      });

      it("reject error if deposit amount is greater than balance", async function() {
        const stub = sandbox.stub(Fingate.prototype, "getCallBalance");
        stub.resolves("0");
        const stub1 = sandbox.stub(Fingate.prototype, "connect");
        stub1.resolves();
        const spy = sandbox.spy(vm, "changeLoadingState");
        const spy1 = sandbox.spy(Fingate.prototype, "transfer");
        const spy2 = sandbox.spy(Fingate.prototype, "disconnect");
        try {
          await vm.depositCall(secret, address, amount, memo);
        } catch (error) {
          const args = spy.args;
          expect(stub.calledOnceWithExactly(address)).toBe(true);
          expect(stub1.calledOnce).toBe(true);
          expect(spy.calledOnce).toBe(true);
          expect(spy1.called).toBe(false);
          expect(spy2.called).toBe(true);
          expect(args[0][0]).toBe("获取CALL钱包余额");
          expect(error.message).toBe("余额：0，请检查是否足够！");
        }
      });

      it("reject error if deposit failed", async function() {
        const stub = sandbox.stub(Fingate.prototype, "getCallBalance");
        stub.resolves("1");
        const stub1 = sandbox.stub(Fingate.prototype, "connect");
        stub1.resolves();
        const stub2 = sandbox.stub(Fingate.prototype, "transfer");
        stub2.rejects();
        const spy = sandbox.spy(vm, "changeLoadingState");
        try {
          await vm.depositCall(secret, address, amount, memo);
        } catch (error) {
          const args = spy.args;
          expect(spy.calledTwice).toBe(true);
          expect(args[0][0]).toBe("获取CALL钱包余额");
          expect(args[1][0]).toBe("获取余额成功，转账中");
          expect(error.message).toBe("充币失败，可能网络拥堵或余额不足，请稍后再试！");
        }
      });

      it("resolve hash if deposit success", async function() {
        const stub = sandbox.stub(Fingate.prototype, "getCallBalance");
        stub.resolves("1");
        const stub1 = sandbox.stub(Fingate.prototype, "connect");
        stub1.resolves();
        const stub2 = sandbox.stub(Fingate.prototype, "transfer");
        stub2.resolves(testConfig.testHash);
        const spy = sandbox.spy(vm, "changeLoadingState");
        let hash;
        try {
          hash = await vm.depositCall(secret, address, amount, memo);
        } finally {
          const args = spy.args;
          expect(stub2.calledOnceWithExactly(secret, "cs9AWskwRmJrcMsszqC4hWeedCL5vSpexv", amount, memo)).toBe(true);
          expect(spy.calledTwice).toBe(true);
          expect(args[0][0]).toBe("获取CALL钱包余额");
          expect(args[1][0]).toBe("获取余额成功，转账中");
          expect(hash).toBe(testConfig.testHash);
        }
      });
    })

    describe("test depositRipple api", function() {
      const Fingate = require('jcc-ripple-utils').RippleFingate;
      const secret = testConfig.testRippleSecret;
      const address = testConfig.testRippleAddress;
      wrapper.setData({ coin: "jxrp" })
      vm.init("jxrp");

      afterEach(() => {
        sandbox.restore();
        fingateInstance.destroy();
      });

      it("depositRipple shoude be a function", function() {
        expect(typeof vm.depositRipple).toBe("function");
      })

      it("reject error if deposit amount is greater than balance", async function() {

        const stub = sandbox.stub(Fingate.prototype, "getXrpBalance");
        stub.resolves("0");
        const stub1 = sandbox.stub(Fingate.prototype, "connect");
        stub1.resolves();
        const spy = sandbox.spy(vm, "changeLoadingState");
        const spy1 = sandbox.spy(Fingate.prototype, "transfer");
        const spy2 = sandbox.spy(Fingate.prototype, "disconnect");
        try {
          await vm.depositRipple(secret, address, amount, memo);
        } catch (error) {
          const args = spy.args;
          expect(stub.calledOnceWithExactly(address)).toBe(true);
          expect(stub1.calledOnce).toBe(true);
          expect(spy.calledOnce).toBe(true);
          expect(spy1.called).toBe(false);
          expect(spy2.called).toBe(true);
          expect(args[0][0]).toBe("获取XRP钱包余额");
          expect(error.message).toBe("余额：0，请检查是否足够！");
        }
      });

      it("reject error if the balance is less than the sum of amount and limit", async function() {
        const stub = sandbox.stub(Fingate.prototype, "getXrpBalance");
        stub.resolves("21.099999999999999999");
        const stub1 = sandbox.stub(Fingate.prototype, "connect");
        stub1.resolves();
        const spy = sandbox.spy(vm, "changeLoadingState");
        const spy1 = sandbox.spy(Fingate.prototype, "transfer");
        const spy2 = sandbox.spy(Fingate.prototype, "disconnect");
        try {
          await vm.depositRipple(secret, address, amount, memo);
        } catch (error) {
          const args = spy.args;
          expect(stub.calledOnceWithExactly(address)).toBe(true);
          expect(stub1.calledOnce).toBe(true);
          expect(spy.calledOnce).toBe(true);
          expect(spy1.called).toBe(false);
          expect(spy2.called).toBe(true);
          expect(args[0][0]).toBe("获取XRP钱包余额");
          expect(error.message).toBe("转入前请确保瑞波钱包保留20个以上XRP");
        }
      });

      it("reject error if deposit failed", async function() {
        const stub = sandbox.stub(Fingate.prototype, "getXrpBalance");
        stub.resolves("25");
        const stub1 = sandbox.stub(Fingate.prototype, "connect");
        stub1.resolves();
        const stub2 = sandbox.stub(Fingate.prototype, "transfer");
        stub2.rejects();
        const spy = sandbox.spy(vm, "changeLoadingState");
        try {
          await vm.depositRipple(secret, address, amount, memo);
        } catch (error) {
          const args = spy.args;
          expect(spy.calledTwice).toBe(true);
          expect(args[0][0]).toBe("获取XRP钱包余额");
          expect(args[1][0]).toBe("获取余额成功，转账中");
          expect(error.message).toBe("充币失败，可能网络拥堵或余额不足，请稍后再试！");
        }
      });

      it("resolve hash if deposit success", async function() {
        const stub = sandbox.stub(Fingate.prototype, "getXrpBalance");
        stub.resolves("21.1");
        const stub1 = sandbox.stub(Fingate.prototype, "connect");
        stub1.resolves();
        const stub2 = sandbox.stub(Fingate.prototype, "transfer");
        stub2.resolves(testConfig.testHash);
        const spy = sandbox.spy(vm, "changeLoadingState");
        let hash;
        try {
          hash = await vm.depositRipple(secret, address, amount, memo);
        } finally {
          const args = spy.args;
          expect(stub2.calledOnceWithExactly(secret, "rMUpPikgdhmtCida2zf4CMBLrBREfCeYcy", amount, memo)).toBe(true);
          expect(spy.calledTwice).toBe(true);
          expect(args[0][0]).toBe("获取XRP钱包余额");
          expect(args[1][0]).toBe("获取余额成功，转账中");
          expect(hash).toBe(testConfig.testHash);
        }
      });
    })

    describe("test depositBizain api", function() {
      const Fingate = require('jcc-bizain-utils').BizainFingate;
      const secret = testConfig.testBizainSecret;
      const address = testConfig.testBizainAddress;
      wrapper.setData({ coin: "jbiz" })
      vm.init("jbiz");

      afterEach(() => {
        sandbox.restore();
        fingateInstance.destroy();
      });

      it("depositBizain shoude be a function", function() {
        expect(typeof vm.depositBizain).toBe("function");
      })

      it("reject error if deposit amount is greater than balance", async function() {
        const stub = sandbox.stub(Fingate.prototype, "balanceOf");
        stub.resolves("0");
        const stub1 = sandbox.stub(Fingate.prototype, "connect");
        stub1.resolves();
        const stub2 = sandbox.stub(Fingate.prototype, "disconnect");
        const spy = sandbox.spy(vm, "changeLoadingState");
        const spy1 = sandbox.spy(Fingate.prototype, "transfer");

        try {
          await vm.depositBizain(secret, address, amount, memo);
        } catch (error) {
          const args = spy.args;
          expect(stub.calledOnceWithExactly(address)).toBe(true);
          expect(stub1.calledOnce).toBe(true);
          expect(stub2.called).toBe(true);
          expect(spy.calledOnce).toBe(true);
          expect(spy1.called).toBe(false);
          expect(args[0][0]).toBe("获取BIZ钱包余额");
          expect(error.message).toBe("余额：0，请检查是否足够！");
        }
      });

      it("reject error if deposit failed", async function() {
        const stub = sandbox.stub(Fingate.prototype, "balanceOf");
        stub.resolves("1");
        const stub1 = sandbox.stub(Fingate.prototype, "connect");
        stub1.resolves();
        const stub2 = sandbox.stub(Fingate.prototype, "transfer");
        stub2.rejects();
        sandbox.stub(Fingate.prototype, "disconnect");
        const spy = sandbox.spy(vm, "changeLoadingState");
        try {
          await vm.depositBizain(secret, address, amount, memo);
        } catch (error) {
          const args = spy.args;
          expect(spy.calledTwice).toBe(true);
          expect(args[0][0]).toBe("获取BIZ钱包余额");
          expect(args[1][0]).toBe("获取余额成功，转账中");
          expect(error.message).toBe("充币失败，可能网络拥堵或余额不足，请稍后再试！");
        }
      });

      it("resolve hash if deposit success", async function() {
        const stub = sandbox.stub(Fingate.prototype, "balanceOf");
        stub.resolves("1");
        const stub1 = sandbox.stub(Fingate.prototype, "connect");
        stub1.resolves();
        const stub2 = sandbox.stub(Fingate.prototype, "transfer");
        stub2.resolves(testConfig.testHash);
        sandbox.stub(Fingate.prototype, "disconnect");
        const spy = sandbox.spy(vm, "changeLoadingState");
        let hash;
        try {
          hash = await vm.depositBizain(secret, address, amount, memo);
        } finally {
          const args = spy.args;
          expect(stub2.calledOnceWithExactly(secret, "bwtC9ARd3wo7Kx3gKQ49uVgcKxoAiV1iM2", amount, memo)).toBe(true);
          expect(spy.calledTwice).toBe(true);
          expect(args[0][0]).toBe("获取BIZ钱包余额");
          expect(args[1][0]).toBe("获取余额成功，转账中");
          expect(hash).toBe(testConfig.testHash);
        }
      });
    })

    describe("test depositStream api", function() {
      const Fingate = require('jcc-stream-utils').StreamFingate;
      const secret = testConfig.testStreamSecret;
      const address = testConfig.testStreamAddress;
      wrapper.setData({ coin: "jstm" })
      vm.init("jstm");

      afterEach(() => {
        sandbox.restore();
        fingateInstance.destroy();
      });

      it("depositStream shoude be a function", function() {
        expect(typeof vm.depositStream).toBe("function");
      })

      it("reject error if deposit amount is greater than balance", async function() {
        const stub = sandbox.stub(Fingate.prototype, "getBalance");
        stub.resolves("0");
        const stub1 = sandbox.stub(Fingate.prototype, "connect");
        const spy = sandbox.spy(vm, "changeLoadingState");
        const spy1 = sandbox.spy(Fingate.prototype, "transfer");
        const spy2 = sandbox.spy(Fingate.prototype, "disconnect");
        try {
          await vm.depositStream(secret, address, amount, memo);
        } catch (error) {
          const args = spy.args;
          expect(stub.calledOnceWithExactly(address)).toBe(true);
          expect(stub1.calledOnce).toBe(true);
          expect(spy.calledOnce).toBe(true);
          expect(spy1.called).toBe(false);
          expect(spy2.called).toBe(true);
          expect(args[0][0]).toBe("获取STM钱包余额");
          expect(error.message).toBe("余额：0，请检查是否足够！");
        }
      });

      it("reject error if deposit failed", async function() {
        sandbox.stub(Fingate.prototype, "connect");
        const stub = sandbox.stub(Fingate.prototype, "getBalance");
        stub.resolves("1");
        const stub1 = sandbox.stub(Fingate.prototype, "transfer");
        stub1.rejects();
        const spy = sandbox.spy(vm, "changeLoadingState");
        try {
          await vm.depositStream(secret, address, amount, memo);
        } catch (error) {
          const args = spy.args;
          expect(spy.calledTwice).toBe(true);
          expect(args[0][0]).toBe("获取STM钱包余额");
          expect(args[1][0]).toBe("获取余额成功，转账中");
          expect(error.message).toBe("充币失败，可能网络拥堵或余额不足，请稍后再试！");
        }
      });

      it("resolve hash if deposit success", async function() {
        sandbox.stub(Fingate.prototype, "connect");
        const stub = sandbox.stub(Fingate.prototype, "getBalance");
        stub.resolves("1");
        const stub1 = sandbox.stub(Fingate.prototype, "transfer");
        stub1.resolves(testConfig.testHash);
        const spy = sandbox.spy(vm, "changeLoadingState");
        let hash;
        try {
          hash = await vm.depositStream(secret, address, amount, memo);
        } finally {
          const args = spy.args;
          expect(stub1.calledOnceWithExactly(secret, "vn4K541zh3vNHHJJaos2Poc4z3RiMHLHcK", amount, memo)).toBe(true);
          expect(spy.calledTwice).toBe(true);
          expect(args[0][0]).toBe("获取STM钱包余额");
          expect(args[1][0]).toBe("获取余额成功，转账中");
          expect(hash).toBe(testConfig.testHash);
        }
      });
    })

    describe("test depositEthereum api", function() {
      const Ethereum = require('jcc-ethereum-utils').Ethereum;
      const Fingate = require('jcc-ethereum-utils').Fingate;
      const ERC20 = require('jcc-ethereum-utils').ERC20;
      const secret = testConfig.testEthereumSecret;
      const address = testConfig.testEthereumAddress;
      const scAddress = "0x3907acb4c1818adf72d965c08e0a79af16e7ffb8";
      const jccContract = "0x9BD4810a407812042F938d2f69f673843301cfa6";
      const notPendingState = {
        '0': '0',
        '1': '',
        '2': '0',
        amount: '0',
        jtaddress: '',
        state: '0'
      };
      const pendingOrder = {
        '0': '1000000000000000',
        '1': 'jwnqKpXJYJPeAnUdVUv3LfbxiJh5ZVXh79',
        '2': '0',
        amount: '1000000000000000',
        jtaddress: 'jwnqKpXJYJPeAnUdVUv3LfbxiJh5ZVXh79',
        state: '0'
      };

      afterEach(() => {
        sandbox.restore();
        fingateInstance.destroy();
      });

      it("depositEthereum shoude be a function", function() {
        expect(typeof vm.depositEthereum).toBe("function");
      })

      it("deposit eth: reject error if deposit amount is greater than balance", async function() {
        wrapper.setData({ coin: "jeth" })
        wrapper.setProps({ coin: 'jeth' });
        const spy = sandbox.spy(vm, "changeLoadingState");
        const spy1 = sandbox.spy(Fingate.prototype, "init");
        const spy2 = sandbox.spy(Fingate.prototype, "depositState");
        const spy3 = sandbox.spy(Fingate.prototype, "deposit");
        const spy4 = sandbox.spy(Fingate.prototype, "depositToken");
        const spy5 = sandbox.spy(ERC20.prototype, "transfer");
        const stub = sandbox.stub(Ethereum.prototype, "getBalance");
        stub.resolves("0");
        try {
          await vm.depositEthereum(secret, address, amount, memo);
        } catch (error) {
          const args = spy.args;
          expect(spy.calledOnce).toBe(true);
          expect(args[0][0]).toBe("获取ETH钱包余额");
          expect(spy1.calledOnceWith(scAddress)).toBe(true);
          expect(spy2.called).toBe(false);
          expect(spy3.called).toBe(false);
          expect(spy4.called).toBe(false);
          expect(spy5.called).toBe(false);
          expect(stub.calledOnceWithExactly(address)).toBe(true);
          expect(error.message).toBe("余额：0，请检查是否足够！");
        }
      });

      it("deposit eth: reject error if the balance is less than the sum of amount and limit", async function() {
        const stub = sandbox.stub(Ethereum.prototype, "getBalance");
        stub.resolves("1.0999999999999");
        const spy = sandbox.spy(vm, "changeLoadingState");
        const spy1 = sandbox.spy(Fingate.prototype, "depositState");
        const spy2 = sandbox.spy(Fingate.prototype, "deposit");
        const spy3 = sandbox.spy(Fingate.prototype, "depositToken");
        const spy4 = sandbox.spy(ERC20.prototype, "transfer");
        try {
          await vm.depositEthereum(secret, address, amount, memo);
        } catch (error) {
          expect(spy.calledOnce).toBe(true);
          expect(spy1.called).toBe(false);
          expect(spy2.called).toBe(false);
          expect(spy3.called).toBe(false);
          expect(spy4.called).toBe(false);
          expect(error.message).toBe("充币前请确保以太钱包保留0.1ETH（智能合约银关处理门槛，实际消耗gas会按照当前网络实况）");
        }
      });

      it("deposit eth: reject error if has pending order", async function() {
        const stub = sandbox.stub(Ethereum.prototype, "getBalance");
        stub.resolves("1.1");
        const stub1 = sandbox.stub(Fingate.prototype, "depositState");
        stub1.resolves(pendingOrder);
        const spy = sandbox.spy(vm, "changeLoadingState");
        const spy1 = sandbox.spy(Fingate.prototype, "deposit");
        const spy2 = sandbox.spy(Fingate.prototype, "depositToken");
        const spy3 = sandbox.spy(ERC20.prototype, "transfer");
        try {
          await vm.depositEthereum(secret, address, amount, memo);
        } catch (error) {
          expect(stub1.calledOnceWithExactly(address)).toBe(true);
          expect(spy.calledOnce).toBe(true);
          expect(spy1.called).toBe(false);
          expect(spy2.called).toBe(false);
          expect(spy3.called).toBe(false);
          expect(error.message).toBe("上一个充币流程未结束，不能进行新的充币，请稍等！");
        }
      });

      it("deposit eth: reject error if deposit failed", async function() {
        const stub = sandbox.stub(Ethereum.prototype, "getBalance");
        stub.resolves("1.1");
        const stub1 = sandbox.stub(Fingate.prototype, "depositState");
        stub1.resolves(notPendingState);
        const stub2 = sandbox.stub(Fingate.prototype, "deposit");
        stub2.rejects();
        const spy = sandbox.spy(Fingate.prototype, "depositToken");
        const spy1 = sandbox.spy(ERC20.prototype, "transfer");
        try {
          await vm.depositEthereum(secret, address, amount, memo);
        } catch (error) {
          expect(spy.called).toBe(false);
          expect(spy1.called).toBe(false);
          expect(stub2.calledOnceWithExactly(secret, memo.jtaddress, amount)).toBe(true);
          expect(error.message).toBe("充币失败，可能网络拥堵或余额不足，请稍后再试！");
        }
      });

      it("deposit eth: resolve hash if deposit success", async function() {
        const stub = sandbox.stub(Ethereum.prototype, "getBalance");
        stub.resolves("1.1");
        const stub1 = sandbox.stub(Fingate.prototype, "depositState");
        stub1.resolves(notPendingState);
        const stub2 = sandbox.stub(Fingate.prototype, "deposit");
        stub2.resolves(testConfig.testHash);
        const spy = sandbox.spy(vm, "changeLoadingState");
        let hash;
        try {
          hash = await vm.depositEthereum(secret, address, amount, memo);
        } finally {
          const args = spy.args;
          expect(spy.calledTwice).toBe(true);
          expect(args[0][0]).toBe("获取ETH钱包余额");
          expect(args[1][0]).toBe("获取余额成功，转账中");
          expect(stub2.calledOnceWithExactly(secret, memo.jtaddress, amount)).toBe(true);
          expect(hash).toBe(testConfig.testHash);
        }
      });

      it("deposit erc20: reject error if the balance of eth is less than limit", async function() {
        wrapper.setData({ coin: "jjcc" })
        wrapper.setProps({ coin: 'jjcc' });
        const stub = sandbox.stub(Ethereum.prototype, "getBalance");
        stub.resolves("0.0999999999999");
        const spy = sandbox.spy(vm, "changeLoadingState");
        const spy1 = sandbox.spy(Fingate.prototype, "depositState");
        const spy2 = sandbox.spy(Fingate.prototype, "deposit");
        const spy3 = sandbox.spy(Fingate.prototype, "depositToken");
        const spy4 = sandbox.spy(ERC20.prototype, "transfer");
        try {
          await vm.depositEthereum(secret, address, amount, memo);
        } catch (error) {
          const args = spy.args;
          expect(spy.calledOnce).toBe(true);
          expect(args[0][0]).toBe("获取ETH钱包余额");
          expect(spy1.called).toBe(false);
          expect(spy2.called).toBe(false);
          expect(spy3.called).toBe(false);
          expect(spy4.called).toBe(false);
          expect(stub.calledOnceWithExactly(address)).toBe(true);
          expect(error.message).toBe("充币前请确保以太钱包保留0.1ETH（智能合约银关处理门槛，实际消耗gas会按照当前网络实况）");
        }
      });

      it("deposit erc20: reject error if has pending order", async function() {
        const spy = sandbox.spy(vm, "changeLoadingState");
        const spy1 = sandbox.spy(ERC20.prototype, "balanceOf");
        const spy2 = sandbox.spy(Fingate.prototype, "depositToken");
        const spy3 = sandbox.spy(ERC20.prototype, "transfer");
        const spy4 = sandbox.spy(Fingate.prototype, "deposit");
        const spy5 = sandbox.spy(ERC20.prototype, "init");
        const stub = sandbox.stub(Ethereum.prototype, "getBalance");
        stub.resolves("0.1");
        const stub1 = sandbox.stub(Fingate.prototype, "depositState");
        stub1.resolves(pendingOrder);
        try {
          await vm.depositEthereum(secret, address, amount, memo);
        } catch (error) {
          expect(spy.calledOnce).toBe(true);
          expect(spy1.called).toBe(false);
          expect(spy2.called).toBe(false);
          expect(spy3.called).toBe(false);
          expect(spy4.called).toBe(false);
          expect(spy5.calledOnceWith(jccContract)).toBe(true);
          expect(stub.calledOnceWithExactly(address)).toBe(true);
          expect(stub1.calledOnceWithExactly(address, jccContract)).toBe(true);
          expect(error.message).toBe("上一个充币流程未结束，不能进行新的充币，请稍等！");
        }
      });

      it("deposit erc20: reject error if deposit amount is greater than balance", async function() {
        const spy = sandbox.spy(vm, "changeLoadingState");
        const spy1 = sandbox.spy(Fingate.prototype, "depositToken");
        const spy2 = sandbox.spy(ERC20.prototype, "transfer");
        const spy3 = sandbox.spy(Fingate.prototype, "deposit");
        const stub = sandbox.stub(Ethereum.prototype, "getBalance");
        stub.resolves("0.1");
        const stub1 = sandbox.stub(Fingate.prototype, "depositState");
        stub1.resolves(notPendingState);
        const stub2 = sandbox.stub(ERC20.prototype, "balanceOf");
        stub2.resolves("0");
        try {
          await vm.depositEthereum(secret, address, amount, memo);
        } catch (error) {
          expect(spy.calledOnce).toBe(true);
          expect(spy1.called).toBe(false);
          expect(spy2.called).toBe(false);
          expect(spy3.called).toBe(false);
          expect(stub2.calledOnceWithExactly(address)).toBe(true);
          expect(error.message).toBe("余额：0，请检查是否足够！");
        }
      });

      it("deposit erc20: reject error if transfer failed", async function() {
        const spy = sandbox.spy(Fingate.prototype, "depositToken");
        const stub = sandbox.stub(Ethereum.prototype, "getBalance");
        stub.resolves("0.1");
        const stub1 = sandbox.stub(Fingate.prototype, "depositState");
        stub1.resolves(notPendingState);
        const stub2 = sandbox.stub(ERC20.prototype, "decimals");
        stub2.resolves(18);
        const stub3 = sandbox.stub(ERC20.prototype, "balanceOf");
        stub3.resolves("1");
        const stub4 = sandbox.stub(ERC20.prototype, "transfer");
        stub4.rejects();
        try {
          await vm.depositEthereum(secret, address, amount, memo);
        } catch (error) {
          expect(spy.calledOnce).toBe(false);
          expect(stub2.calledOnce).toBe(true);
          expect(stub4.calledOnceWithExactly(secret, scAddress, amount)).toBe(true);
          expect(error.message).toBe("充币失败，可能网络拥堵或余额不足，请稍后再试！");
        }
      });

      it("deposit erc20: resolve hash if depositToken first success and depositToken should be called only once", async function() {
        const stub = sandbox.stub(Ethereum.prototype, "getBalance");
        stub.resolves("0.1");
        const stub1 = sandbox.stub(Fingate.prototype, "depositState");
        stub1.resolves(notPendingState);
        const stub2 = sandbox.stub(ERC20.prototype, "decimals");
        stub2.resolves(18);
        const stub3 = sandbox.stub(ERC20.prototype, "balanceOf");
        stub3.resolves("1");
        const stub4 = sandbox.stub(ERC20.prototype, "transfer");
        stub4.resolves(testConfig.testHash);
        const stub5 = sandbox.stub(Fingate.prototype, "depositToken");
        stub5.resolves(testConfig.testHash);
        let hash;
        try {
          hash = await vm.depositEthereum(secret, address, amount, memo);
        } finally {
          expect(stub5.calledOnceWithExactly(memo.jtaddress, jccContract, 18, amount, testConfig.testHash, secret)).toBe(true);
          expect(hash).toBe(testConfig.testHash);
        }
      });

      it("deposit erc20: resolve hash if depositToken first failed and second success and depositToken should be called twice", async function() {
        const stub = sandbox.stub(Ethereum.prototype, "getBalance");
        stub.resolves("0.1");
        const stub1 = sandbox.stub(Fingate.prototype, "depositState");
        stub1.resolves(notPendingState);
        const stub2 = sandbox.stub(ERC20.prototype, "decimals");
        stub2.resolves(18);
        const stub3 = sandbox.stub(ERC20.prototype, "balanceOf");
        stub3.resolves("1");
        const stub4 = sandbox.stub(ERC20.prototype, "transfer");
        stub4.resolves(testConfig.testHash);
        const stub5 = sandbox.stub(Fingate.prototype, "depositToken");
        stub5.onCall(0)
          .rejects(new Error("deposit failed"))
          .onCall(1)
          .resolves(testConfig.testHash);
        let hash;
        try {
          hash = await vm.depositEthereum(secret, address, amount, memo);
        } finally {
          expect(stub5.calledTwice).toBe(true);
          expect(stub5.alwaysCalledWithExactly(memo.jtaddress, jccContract, 18, amount, testConfig.testHash, secret)).toBe(true);
          expect(hash).toBe(testConfig.testHash);
        }
      });
    })

    describe("test depositMoac api", function() {
      const Moac = require('jcc-moac-utils').Moac;
      const Fingate = require('jcc-moac-utils').Fingate;
      const ERC20 = require('jcc-moac-utils').ERC20;
      const secret = testConfig.testMoacSecret;
      const address = testConfig.testMoacAddress;
      const scAddress = "0x66c9b619215db959ec137ede6b96f3fa6fd35a8a";
      const fstContract = "0x4c6007cea426e543551f2cb6392e6d6768f74706";
      const notPendingState = ['0', '', '0'];
      const pendingOrder = ['1', '1', '1'];

      afterEach(() => {
        sandbox.restore();
        fingateInstance.destroy();
      });

      it("depositMoac shoude be a function", function() {
        expect(typeof vm.depositMoac).toBe("function");
      })

      it("deposit moac: reject error if deposit amount is greater than balance", async function() {
        wrapper.setData({ coin: "jmoac" })
        wrapper.setProps({ coin: 'jmoac' });
        const stub = sandbox.stub(Moac.prototype, "getBalance");
        stub.resolves("0");
        const spy = sandbox.spy(vm, "changeLoadingState");
        const spy1 = sandbox.spy(Fingate.prototype, "depositState");
        const spy2 = sandbox.spy(Fingate.prototype, "deposit");
        const spy3 = sandbox.spy(Fingate.prototype, "depositToken");
        const spy4 = sandbox.spy(ERC20.prototype, "transfer");
        const spy5 = sandbox.spy(Fingate.prototype, "init");
        try {
          await vm.depositMoac(secret, address, amount, memo);
        } catch (error) {
          const args = spy.args;
          expect(args[0][0]).toBe("获取MOAC钱包余额");
          expect(spy.calledOnce).toBe(true);
          expect(spy1.called).toBe(false);
          expect(spy2.called).toBe(false);
          expect(spy3.called).toBe(false);
          expect(spy4.called).toBe(false);
          expect(spy5.calledOnceWith(scAddress)).toBe(true);
          expect(stub.calledOnceWithExactly(address)).toBe(true);
          expect(error.message).toBe("余额：0，请检查是否足够！");
        }
      });

      it("deposit moac: reject error if the balance is less than the sum of amount and limit", async function() {
        const stub = sandbox.stub(Moac.prototype, "getBalance");
        stub.resolves("1.0999999999999");
        const spy = sandbox.spy(vm, "changeLoadingState");
        const spy1 = sandbox.spy(Fingate.prototype, "depositState");
        const spy2 = sandbox.spy(Fingate.prototype, "deposit");
        const spy3 = sandbox.spy(Fingate.prototype, "depositToken");
        const spy4 = sandbox.spy(ERC20.prototype, "transfer");
        try {
          await vm.depositMoac(secret, address, amount, memo);
        } catch (error) {
          expect(spy.calledOnce).toBe(true);
          expect(spy1.called).toBe(false);
          expect(spy2.called).toBe(false);
          expect(spy3.called).toBe(false);
          expect(spy4.called).toBe(false);
          expect(error.message).toBe("充币前请确保墨客钱包保留0.1MOAC（智能合约银关处理门槛，实际消耗gas会按照当前网络实况）");
        }
      });

      it("deposit moac: reject error if has pending order", async function() {
        const stub = sandbox.stub(Moac.prototype, "getBalance");
        stub.resolves("1.1");
        const stub1 = sandbox.stub(Fingate.prototype, "depositState");
        stub1.resolves(pendingOrder);
        const spy = sandbox.spy(vm, "changeLoadingState");
        const spy1 = sandbox.spy(Fingate.prototype, "deposit");
        const spy2 = sandbox.spy(Fingate.prototype, "depositToken");
        const spy3 = sandbox.spy(ERC20.prototype, "transfer");
        try {
          await vm.depositMoac(secret, address, amount, memo);
        } catch (error) {
          expect(stub1.calledOnceWithExactly(address)).toBe(true);
          expect(spy.calledOnce).toBe(true);
          expect(spy1.called).toBe(false);
          expect(spy2.called).toBe(false);
          expect(spy3.called).toBe(false);
          expect(error.message).toBe("上一个充币流程未结束，不能进行新的充币，请稍等！");
        }
      });

      it("deposit moac: reject error if deposit failed", async function() {
        const stub = sandbox.stub(Moac.prototype, "getBalance");
        stub.resolves("1.1");
        const stub1 = sandbox.stub(Fingate.prototype, "depositState");
        stub1.resolves(notPendingState);
        const stub2 = sandbox.stub(Fingate.prototype, "deposit");
        stub2.rejects();
        const spy = sandbox.spy(vm, "changeLoadingState");
        const spy1 = sandbox.spy(Fingate.prototype, "depositToken");
        const spy2 = sandbox.spy(ERC20.prototype, "transfer");
        try {
          await vm.depositMoac(secret, address, amount, memo);
        } catch (error) {
          const args = spy.args;
          expect(spy.calledTwice).toBe(true);
          expect(spy1.called).toBe(false);
          expect(spy2.called).toBe(false);
          expect(args[0][0]).toBe("获取MOAC钱包余额");
          expect(args[1][0]).toBe("获取余额成功，转账中");
          expect(stub2.calledOnceWithExactly(memo.jtaddress, amount, secret)).toBe(true);
          expect(error.message).toBe("充币失败，可能网络拥堵或余额不足，请稍后再试！");
        }
      });

      it("deposit moac: resolve hash if deposit success", async function() {
        const stub = sandbox.stub(Moac.prototype, "getBalance");
        stub.resolves("1.1");
        const stub1 = sandbox.stub(Fingate.prototype, "depositState");
        stub1.resolves(notPendingState);
        const stub2 = sandbox.stub(Fingate.prototype, "deposit");
        stub2.resolves(testConfig.testHash);
        const spy = sandbox.spy(Fingate.prototype, "depositToken");
        const spy1 = sandbox.spy(ERC20.prototype, "transfer");
        let hash;
        try {
          hash = await vm.depositMoac(secret, address, amount, memo);
        } finally {
          expect(stub2.calledOnceWithExactly(memo.jtaddress, amount, secret)).toBe(true);
          expect(spy.called).toBe(false);
          expect(spy1.called).toBe(false);
          expect(hash).toBe(testConfig.testHash);
        }
      });

      it("deposit erc20: reject error if the balance of moac is less than limit", async function() {
        wrapper.setData({ coin: "jfst" })
        wrapper.setProps({ coin: 'jfst' });
        const stub = sandbox.stub(Moac.prototype, "getBalance");
        stub.resolves("0.0999999999999");
        const spy = sandbox.spy(vm, "changeLoadingState");
        const spy1 = sandbox.spy(Fingate.prototype, "depositState");
        const spy2 = sandbox.spy(Fingate.prototype, "deposit");
        const spy3 = sandbox.spy(Fingate.prototype, "depositToken");
        const spy4 = sandbox.spy(ERC20.prototype, "transfer");
        try {
          await vm.depositMoac(secret, address, amount, memo);
        } catch (error) {
          const args = spy.args;
          expect(spy.calledOnce).toBe(true);
          expect(args[0][0]).toBe("获取MOAC钱包余额");
          expect(spy1.called).toBe(false);
          expect(spy2.called).toBe(false);
          expect(spy3.called).toBe(false);
          expect(spy4.called).toBe(false);
          expect(error.message).toBe("充币前请确保墨客钱包保留0.1MOAC（智能合约银关处理门槛，实际消耗gas会按照当前网络实况）");
        }
      });

      it("deposit erc20: reject error if has pending order", async function() {
        const spy = sandbox.spy(vm, "changeLoadingState");
        const spy1 = sandbox.spy(Fingate.prototype, "init");
        const spy2 = sandbox.spy(ERC20.prototype, "init");
        const spy3 = sandbox.spy(ERC20.prototype, "decimals");
        const spy4 = sandbox.spy(ERC20.prototype, "balanceOf");
        const spy5 = sandbox.spy(Fingate.prototype, "depositToken");
        const spy6 = sandbox.spy(ERC20.prototype, "transfer");
        const spy7 = sandbox.spy(Fingate.prototype, "deposit");

        const stub = sandbox.stub(Moac.prototype, "getBalance");
        stub.resolves("0.1");
        const stub1 = sandbox.stub(Fingate.prototype, "depositState");
        stub1.resolves(pendingOrder);
        try {
          await vm.depositMoac(secret, address, amount, memo);
        } catch (error) {
          expect(spy.calledOnce).toBe(true);
          expect(spy1.calledOnceWith(scAddress)).toBe(true);
          expect(spy2.calledOnceWith(fstContract)).toBe(true);
          expect(spy3.called).toBe(false);
          expect(spy4.called).toBe(false);
          expect(spy5.called).toBe(false);
          expect(spy6.called).toBe(false);
          expect(spy7.called).toBe(false);
          expect(stub1.calledOnceWithExactly(address, fstContract)).toBe(true);
          expect(error.message).toBe("上一个充币流程未结束，不能进行新的充币，请稍等！");
        }
      });

      it("deposit erc20: reject error if deposit amount is greater than balance", async function() {
        const spy = sandbox.spy(vm, "changeLoadingState");
        const spy1 = sandbox.spy(Fingate.prototype, "depositToken");
        const spy2 = sandbox.spy(ERC20.prototype, "transfer");
        const spy3 = sandbox.spy(Fingate.prototype, "deposit");
        const stub = sandbox.stub(Moac.prototype, "getBalance");
        stub.resolves("0.1");
        const stub1 = sandbox.stub(Fingate.prototype, "depositState");
        stub1.resolves(notPendingState);
        const stub2 = sandbox.stub(ERC20.prototype, "balanceOf");
        stub2.resolves("0");
        try {
          await vm.depositMoac(secret, address, amount, memo);
        } catch (error) {
          expect(spy.calledOnce).toBe(true);
          expect(spy1.called).toBe(false);
          expect(spy2.called).toBe(false);
          expect(spy3.called).toBe(false);
          expect(stub2.calledOnceWithExactly(address)).toBe(true);
          expect(error.message).toBe("余额：0，请检查是否足够！");
        }
      });

      it("deposit erc20: reject error if transfer failed", async function() {
        const spy = sandbox.spy(vm, "changeLoadingState");
        const spy1 = sandbox.spy(Fingate.prototype, "depositToken");

        const stub = sandbox.stub(Moac.prototype, "getBalance");
        stub.resolves("0.1");
        const stub1 = sandbox.stub(Fingate.prototype, "depositState");
        stub1.resolves(notPendingState);
        const stub2 = sandbox.stub(ERC20.prototype, "decimals");
        stub2.resolves(18);
        const stub3 = sandbox.stub(ERC20.prototype, "balanceOf");
        stub3.resolves("1");
        const stub4 = sandbox.stub(ERC20.prototype, "transfer");
        stub4.rejects();
        try {
          await vm.depositMoac(secret, address, amount, memo);
        } catch (error) {
          const args = spy.args;
          expect(spy.calledTwice).toBe(true);
          expect(args[0][0]).toBe("获取MOAC钱包余额");
          expect(args[1][0]).toBe("获取余额成功，转账中");
          expect(spy1.called).toBe(false);
          expect(stub4.calledOnceWithExactly(secret, scAddress, amount)).toBe(true);
          expect(error.message).toBe("充币失败，可能网络拥堵或余额不足，请稍后再试！");
        }
      });

      it("deposit erc20: resolve hash if depositToken first success and depositToken should be called only once", async function() {
        const stub = sandbox.stub(Moac.prototype, "getBalance");
        stub.resolves("0.1");
        const stub1 = sandbox.stub(Fingate.prototype, "depositState");
        stub1.resolves(notPendingState);
        const stub2 = sandbox.stub(ERC20.prototype, "decimals");
        stub2.returns(18);
        const stub3 = sandbox.stub(ERC20.prototype, "balanceOf");
        stub3.resolves("1");
        const stub4 = sandbox.stub(ERC20.prototype, "transfer");
        stub4.resolves(testConfig.testHash);
        const stub5 = sandbox.stub(Fingate.prototype, "depositToken");
        stub5.resolves(testConfig.testHash);
        let hash;
        try {
          hash = await vm.depositMoac(secret, address, amount, memo);
        } finally {
          expect(stub5.calledOnceWithExactly(memo.jtaddress, fstContract, 18, amount, testConfig.testHash, secret)).toBe(true);
          expect(hash).toBe(testConfig.testHash);
        }
      });

      it("deposit erc20: resolve hash if depositToken first failed and second success and depositToken should be called twice", async function() {
        const stub = sandbox.stub(Moac.prototype, "getBalance");
        stub.resolves("0.1");
        const stub1 = sandbox.stub(Fingate.prototype, "depositState");
        stub1.resolves(notPendingState);
        const stub2 = sandbox.stub(ERC20.prototype, "decimals");
        stub2.returns(18);
        const stub3 = sandbox.stub(ERC20.prototype, "balanceOf");
        stub3.resolves("1");
        const stub4 = sandbox.stub(ERC20.prototype, "transfer");
        stub4.resolves(testConfig.testHash);
        const stub5 = sandbox.stub(Fingate.prototype, "depositToken");
        stub5.onFirstCall().throws();
        stub5.onSecondCall().resolves(testConfig.testHash);
        let hash;
        try {
          hash = await vm.depositMoac(secret, address, amount, memo);
        } finally {
          expect(stub5.calledTwice).toBe(true);
          expect(stub5.alwaysCalledWithExactly(memo.jtaddress, fstContract, 18, amount, testConfig.testHash, secret)).toBe(true);
          expect(hash).toBe(testConfig.testHash);
        }
      });
    })
  })
})