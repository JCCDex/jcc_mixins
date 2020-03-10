import Withdraw from '../component/withdraw.vue';
import Vue from 'vue'
import { mount, createLocalVue } from '@vue/test-utils';
import sinon from "sinon";
import jccExchange from "jcc_exchange";
const sandbox = sinon.createSandbox();
const localVue = createLocalVue();
const VueI18n = require("vue-i18n");
Vue.config.ignoredElements = ['scroller', "clipboard"]
Vue.use(VueI18n)
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

describe('Withdraw', () => {
  const wrapper = mount(Withdraw, {
    localVue,
    propsData: {
      coin: "jjcc"
    },
    stubs: {
      transition: false
    },
    sync: false,
    data() {
      return {
        mockMoac: "1",
        mockEth: "1"
      }
    },
    i18n,
    methods: {
      changeLoadingState(message) {

      }
    },
    computed: {
      jcNodes() {
        return ["https://srhkinfo43qw2.weidex.vip"];
      },
      eth_moac_gas() {
        return "1";
      },
      availableMOAC() {
        return this.mockMoac;
      },
      availableETH() {
        return this.mockEth;
      }
    }
  });
  const vm = wrapper.vm;

  const amount = "1";

  const swtSecret = testConfig.testSwtSecret;
  const swtAddress = testConfig.testSwtAddress;

  describe("test withdrawStream api", function() {

    const to = "japp9xxt2VHpRwHsoa76GWoQj1VdsjcZQJ";
    const address = testConfig.testStreamAddress;
    const token = "jstm";

    const memo = {
      stm_wallet: address,
      value: amount
    }

    afterEach(() => {
      sandbox.restore();
    });

    it("withdrawStream should be a function", function() {
      expect(typeof vm.withdrawStream).toBe("function");
    });

    it("reject error if withdraw failed", async function() {
      const stub = sandbox.stub(jccExchange, "transfer");
      stub.rejects();
      try {
        await vm.withdrawStream(swtSecret, address, token, amount);
      } catch (error) {
        expect(error.message).toBe("提币失败，请稍后再试！");
      }
    });

    it("resolve hash if withdraw success", async function() {
      const spy = sandbox.spy(vm, "serializePayment");
      const spy1 = sandbox.spy(vm, "transfer");
      const stub = sandbox.stub(jccExchange, "transfer");
      stub.resolves(testConfig.testHash);
      let hash;
      try {
        hash = await vm.withdrawStream(swtSecret, address, token, amount);
      } finally {
        expect(spy.calledOnceWithExactly(swtSecret, to, amount, token, memo)).toBe(true);
        expect(spy1.calledOnceWithExactly({
          address: swtAddress,
          secret: swtSecret,
          to,
          amount,
          issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
          currency: token.toUpperCase(),
          memo: JSON.stringify(memo)
        })).toBe(true);
        expect(hash).toBe(testConfig.testHash);
      }
    });
  });

  describe("test withdrawCall api", function() {

    const to = "jMCJrXRmycsT5tsVuge7Y65v9MrQi9r11E";
    const address = testConfig.testCallAddress;
    const token = "jcall";

    const memo = {
      call_wallet: address,
      value: amount
    }

    afterEach(() => {
      sandbox.restore();
    });

    it("withdrawCall should be a function", function() {
      expect(typeof vm.withdrawCall).toBe("function");
    });

    it("reject error if withdraw failed", async function() {
      const stub = sandbox.stub(jccExchange, "transfer");
      stub.rejects();
      try {
        await vm.withdrawCall(swtSecret, address, token, amount);
      } catch (error) {
        expect(error.message).toBe("提币失败，请稍后再试！");
      }
    });

    it("resolve hash if withdraw success", async function() {
      const spy = sandbox.spy(vm, "serializePayment");
      const spy1 = sandbox.spy(vm, "transfer");
      const stub = sandbox.stub(jccExchange, "transfer");
      stub.resolves(testConfig.testHash);
      let hash;
      try {
        hash = await vm.withdrawCall(swtSecret, address, token, amount);
      } finally {
        expect(spy.calledOnceWithExactly(swtSecret, to, amount, token, memo)).toBe(true);
        expect(spy1.calledOnceWithExactly({
          address: swtAddress,
          secret: swtSecret,
          to,
          amount,
          issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
          currency: token.toUpperCase(),
          memo: JSON.stringify(memo)
        })).toBe(true);
        expect(hash).toBe(testConfig.testHash);
      }
    });
  });

  describe("test withdrawBizain api", function() {

    const to = "jDu7umDxKxeaHoj7eNdUn8YsGWTHZSuEGL";
    const address = testConfig.testBizainAddress;
    const token = "jbiz";

    const memo = {
      biz_wallet: address,
      value: amount,
      chain: "BIZ"
    }

    afterEach(() => {
      sandbox.restore();
    });

    it("withdrawBizain should be a function", function() {
      expect(typeof vm.withdrawBizain).toBe("function");
    });

    it("reject error if withdraw failed", async function() {
      const stub = sandbox.stub(jccExchange, "transfer");
      stub.rejects();
      try {
        await vm.withdrawBizain(swtSecret, address, token, amount);
      } catch (error) {
        expect(error.message).toBe("提币失败，请稍后再试！");
      }
    });

    it("resolve hash if withdraw success", async function() {
      const spy = sandbox.spy(vm, "serializePayment");
      const spy1 = sandbox.spy(vm, "transfer");
      const stub = sandbox.stub(jccExchange, "transfer");
      stub.resolves(testConfig.testHash);
      let hash;
      try {
        hash = await vm.withdrawBizain(swtSecret, address, token, amount);
      } finally {
        expect(spy.calledOnceWithExactly(swtSecret, to, amount, token, memo)).toBe(true);
        expect(spy1.calledOnceWithExactly({
          address: swtAddress,
          secret: swtSecret,
          to,
          amount,
          issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
          currency: token.toUpperCase(),
          memo: JSON.stringify(memo)
        })).toBe(true);
        expect(hash).toBe(testConfig.testHash);
      }
    });
  });

  describe("test withdrawRipple api", function() {

    const to = "jQs5cAcZrKmyWSQgkmUtXsdeFMzwSYcBA4";
    const address = testConfig.testRippleAddress;
    const token = "jxrp";

    const memo = {
      xrp_wallet: address,
      value: amount,
      chain: "XRP"
    }

    afterEach(() => {
      sandbox.restore();
    });

    it("withdrawRipple should be a function", function() {
      expect(typeof vm.withdrawRipple).toBe("function");
    });

    it("reject error if withdraw failed", async function() {

      const stub = sandbox.stub(jccExchange, "transfer");
      stub.rejects();
      try {
        await vm.withdrawRipple(swtSecret, address, token, amount);
      } catch (error) {
        expect(error.message).toBe("提币失败，请稍后再试！");
      }
    });

    it("resolve hash if withdraw success", async function() {

      const spy = sandbox.spy(vm, "serializePayment");
      const spy1 = sandbox.spy(vm, "transfer");
      const stub = sandbox.stub(jccExchange, "transfer");
      stub.resolves(testConfig.testHash);
      let hash;
      try {
        hash = await vm.withdrawRipple(swtSecret, address, token, amount);
      } finally {
        expect(spy.calledOnceWithExactly(swtSecret, to, amount, token, memo)).toBe(true);
        expect(spy1.calledOnceWithExactly({
          address: swtAddress,
          secret: swtSecret,
          to,
          amount,
          issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
          currency: token.toUpperCase(),
          memo: JSON.stringify(memo)
        })).toBe(true);
        expect(hash).toBe(testConfig.testHash);
      }
    });
  });

  describe("test withdrawMoac api", function() {

    const to = "jG9ntUTuBKqDURPUqbGYZRuRDVzPY6bpxL";
    const address = testConfig.testMoacAddress;
    const token = "jmoac";

    const memo = {
      moac_wallet: address,
      value: amount
    }

    afterEach(() => {
      sandbox.restore();
    });

    it("withdrawMoac should be a function", function() {
      expect(typeof vm.withdrawMoac).toBe("function");
    });

    it("withdraw moac: reject error if withdraw failed", async function() {
      const stub = sandbox.stub(jccExchange, "transfer");
      stub.rejects();
      const spy = sandbox.spy(vm, "payGas");
      try {
        await vm.withdrawMoac(swtSecret, address, token, amount);
      } catch (error) {
        expect(spy.called).toBe(false);
        expect(error.message).toBe("提币失败，请稍后再试！");
      }
    });

    it("withdraw moac: resolve hash if withdraw success", async function() {
      const spy = sandbox.spy(vm, "serializePayment");
      const spy1 = sandbox.spy(vm, "transfer");
      const spy2 = sandbox.spy(vm, "changeLoadingState");
      const spy3 = sandbox.spy(vm, "payGas");
      const stub = sandbox.stub(jccExchange, "transfer");
      stub.resolves(testConfig.testHash);
      let hash;
      try {
        hash = await vm.withdrawMoac(swtSecret, address.substring(2), token, amount);
      } finally {
        expect(spy.calledOnceWithExactly(swtSecret, to, amount, token, memo)).toBe(true);
        expect(spy1.calledOnceWithExactly({
          address: swtAddress,
          secret: swtSecret,
          to,
          amount,
          issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
          currency: token.toUpperCase(),
          memo: JSON.stringify(memo)
        })).toBe(true);
        expect(spy2.calledOnceWithExactly("获取转账hash")).toBe(true);
        expect(spy3.called).toBe(false);
        expect(hash).toBe(testConfig.testHash);
      }
    });

    it("withdraw erc20: reject error if moac balance is less than gas", async function() {
      wrapper.setData({
        mockMoac: "0.999999999999999"
      });
      const spy = sandbox.spy(vm, "changeLoadingState");
      const spy1 = sandbox.spy(vm, "serializePayment");
      const spy2 = sandbox.spy(vm, "transfer");

      try {
        await vm.withdrawMoac(swtSecret, address, "jfst", amount);
      } catch (error) {
        expect(spy.called).toBe(false);
        expect(spy1.called).toBe(false);
        expect(spy2.called).toBe(false);
        expect(error.message).toBe("您的提币手续费不足");
      }
    });

    it("withdraw erc20: reject error if transfer gas failed", function(done) {
      wrapper.setData({
        mockMoac: "1"
      });
      const stub = sandbox.stub(jccExchange, "transfer");
      stub.resolves(testConfig.testHash);
      const stub1 = sandbox.stub(vm, "payGas");
      stub1.rejects(new Error("failed"));
      vm.withdrawMoac(swtSecret, address, "jfst", amount).catch(error => {
        expect(error.message).toBe("failed");
        done();
      });
    });

    it("withdraw erc20: resolve hash if withdraw success", function(done) {
      wrapper.setData({
        mockMoac: "1"
      });
      const stub = sandbox.stub(jccExchange, "transfer");
      stub.onFirstCall().resolves(testConfig.testHash);
      stub.onSecondCall().resolves("123456");
      const spy = sandbox.spy(vm, "changeLoadingState");
      const spy1 = sandbox.spy(vm, "payGas");
      const spy2 = sandbox.spy(vm, "transfer");
      const gasMemo = {
        moac_wallet: address,
        value: amount,
        relate: testConfig.testHash
      }
      vm.withdrawMoac(swtSecret, address, "jfst", amount).then(hash => {
        const args = spy.args;
        expect(spy.calledTwice).toBe(true);
        expect(args[0][0]).toBe("获取转账hash");
        expect(args[1][0]).toBe("燃料费扣取中");
        expect(spy1.calledOnceWithExactly(swtSecret, to, "1", token, gasMemo)).toBe(true);
        expect(stub.calledTwice).toBe(true);
        expect(spy2.calledTwice).toBe(true);
        expect(spy2.getCall(0).calledWithExactly({
          address: swtAddress,
          secret: swtSecret,
          to,
          amount,
          issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
          currency: "JFST",
          memo: JSON.stringify(memo)
        })).toBe(true);
        expect(spy2.getCall(1).calledWithExactly({
          address: swtAddress,
          secret: swtSecret,
          to,
          amount,
          issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
          currency: token.toUpperCase(),
          memo: JSON.stringify(gasMemo)
        })).toBe(true);
        expect(hash).toBe(testConfig.testHash);
        done();
      });
    });
  });

  describe("test withdrawEthereum api", function() {

    const to = "jsk45ksJZUB7durZrLt5e86Eu2gtiXNRN4";
    const address = testConfig.testEthereumAddress;
    const token = "jeth";

    const memo = {
      eth_wallet: address,
      value: amount
    }

    afterEach(() => {
      sandbox.restore();
    });

    it("withdrawEthereum should be a function", function() {
      expect(typeof vm.withdrawEthereum).toBe("function");
    });

    it("withdraw eth: reject error if withdraw failed", async function() {
      const stub = sandbox.stub(jccExchange, "transfer");
      stub.rejects();
      const spy = sandbox.spy(vm, "payGas");
      try {
        await vm.withdrawEthereum(swtSecret, address, token, amount);
      } catch (error) {
        expect(spy.called).toBe(false);
        expect(error.message).toBe("提币失败，请稍后再试！");
      }
    });

    it("withdraw eth: resolve hash if withdraw success", async function() {
      const spy = sandbox.spy(vm, "serializePayment");
      const spy1 = sandbox.spy(vm, "transfer");
      const spy2 = sandbox.spy(vm, "changeLoadingState");
      const spy3 = sandbox.spy(vm, "payGas");
      const stub = sandbox.stub(jccExchange, "transfer");
      stub.resolves(testConfig.testHash);
      let hash;
      try {
        hash = await vm.withdrawEthereum(swtSecret, address, token, amount);
      } finally {
        expect(spy.calledOnceWithExactly(swtSecret, to, amount, token, memo)).toBe(true);
        expect(spy1.calledOnceWithExactly({
          address: swtAddress,
          secret: swtSecret,
          to,
          amount,
          issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
          currency: token.toUpperCase(),
          memo: JSON.stringify(memo)
        })).toBe(true);
        expect(spy2.calledOnceWithExactly("获取转账hash")).toBe(true);
        expect(spy3.called).toBe(false);
        expect(hash).toBe(testConfig.testHash);
      }
    });

    it("withdraw erc20: reject error if eth balance is less than gas", async function() {
      wrapper.setData({
        mockEth: "0.999999999999999"
      });
      const spy = sandbox.spy(vm, "changeLoadingState");
      const spy1 = sandbox.spy(vm, "serializePayment");
      const spy2 = sandbox.spy(vm, "transfer");

      try {
        await vm.withdrawEthereum(swtSecret, address, "jfst", amount);
      } catch (error) {
        expect(spy.called).toBe(false);
        expect(spy1.called).toBe(false);
        expect(spy2.called).toBe(false);
        expect(error.message).toBe("您的提币手续费不足");
      }
    });

    it("withdraw erc20: reject error if transfer gas failed", function(done) {
      wrapper.setData({
        mockEth: "1"
      });
      const stub = sandbox.stub(jccExchange, "transfer");
      stub.resolves(testConfig.testHash);
      const stub1 = sandbox.stub(vm, "payGas");
      stub1.rejects(new Error("failed"));
      vm.withdrawEthereum(swtSecret, address, "jjcc", amount).catch(error => {
        expect(error.message).toBe("failed");
        done();
      });
    });

    it("withdraw erc20 which isn't biz: resolve hash if withdraw success", function(done) {
      wrapper.setData({
        mockEth: "1"
      });
      const stub = sandbox.stub(jccExchange, "transfer");
      stub.onFirstCall().resolves(testConfig.testHash);
      stub.onSecondCall().resolves("123456");
      const spy = sandbox.spy(vm, "changeLoadingState");
      const spy1 = sandbox.spy(vm, "payGas");
      const spy2 = sandbox.spy(vm, "transfer");
      const gasMemo = {
        eth_wallet: address,
        value: amount,
        relate: testConfig.testHash
      }
      vm.withdrawEthereum(swtSecret, address, "jjcc", amount).then(hash => {
        const args = spy.args;
        expect(spy.calledTwice).toBe(true);
        expect(args[0][0]).toBe("获取转账hash");
        expect(args[1][0]).toBe("燃料费扣取中");
        expect(spy1.calledOnceWithExactly(swtSecret, to, "1", token, gasMemo)).toBe(true);
        expect(stub.calledTwice).toBe(true);
        expect(spy2.calledTwice).toBe(true);
        expect(spy2.getCall(0).calledWithExactly({
          address: swtAddress,
          secret: swtSecret,
          to,
          amount,
          issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
          currency: "JJCC",
          memo: JSON.stringify(memo)
        })).toBe(true);
        expect(spy2.getCall(1).calledWithExactly({
          address: swtAddress,
          secret: swtSecret,
          to,
          amount,
          issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
          currency: token.toUpperCase(),
          memo: JSON.stringify(gasMemo)
        })).toBe(true);
        expect(hash).toBe(testConfig.testHash);
        done();
      });
    });

    it("withdraw erc20 which is biz: resolve hash if withdraw success", function(done) {
      wrapper.setData({
        mockEth: "1"
      });
      const stub = sandbox.stub(jccExchange, "transfer");
      stub.onFirstCall().resolves(testConfig.testHash);
      stub.onSecondCall().resolves("123456");
      const spy = sandbox.spy(vm, "changeLoadingState");
      const spy1 = sandbox.spy(vm, "payGas");
      const spy2 = sandbox.spy(vm, "transfer");
      const gasMemo = {
        eth_wallet: address,
        value: amount,
        relate: testConfig.testHash
      }
      vm.withdrawEthereum(swtSecret, address, "jbiz", amount).then(hash => {
        const args = spy.args;
        expect(spy.calledTwice).toBe(true);
        expect(args[0][0]).toBe("获取转账hash");
        expect(args[1][0]).toBe("燃料费扣取中");
        expect(spy1.calledOnceWithExactly(swtSecret, to, "1", token, gasMemo)).toBe(true);
        expect(stub.calledTwice).toBe(true);
        expect(spy2.calledTwice).toBe(true);
        expect(spy2.getCall(0).calledWithExactly({
          address: swtAddress,
          secret: swtSecret,
          to,
          amount,
          issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
          currency: "JBIZ",
          memo: JSON.stringify(Object.assign({}, memo, { chain: "ETH" }))
        })).toBe(true);
        expect(spy2.getCall(1).calledWithExactly({
          address: swtAddress,
          secret: swtSecret,
          to,
          amount,
          issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
          currency: token.toUpperCase(),
          memo: JSON.stringify(gasMemo)
        })).toBe(true);
        expect(hash).toBe(testConfig.testHash);
        done();
      });
    });
  });

  describe("test payGas api", function() {

    afterEach(() => {
      sandbox.restore();
    });

    it("payGas should be a function", function() {
      expect(typeof vm.payGas).toBe("function");
    });

    it("shoude be called once if firstly success", async function() {
      const stub = sandbox.stub(vm, "transfer");
      stub.resolves(testConfig.testHash);
      let hash;
      try {
        hash = await vm.payGas(swtSecret, "", "1", "jmoac", {});
      } finally {
        expect(stub.calledOnce).toBe(true);
        expect(hash).toBe(testConfig.testHash);
      }
    });

    it("shoude be called twice if firstly failed but secondly success", async function() {
      const stub = sandbox.stub(vm, "transfer");
      stub.onFirstCall().rejects();
      stub.onSecondCall().resolves(testConfig.testHash);
      let hash;
      try {
        hash = await vm.payGas(swtSecret, "", "1", "jmoac", {});
      } finally {
        expect(stub.calledTwice).toBe(true);
        expect(hash).toBe(testConfig.testHash);
      }
    });

    it("resolve hash if try 9 failed but tenth success", async function() {
      const stub = sandbox.stub(vm, "transfer");
      stub.onCall(0).rejects();
      stub.onCall(1).rejects();
      stub.onCall(2).rejects();
      stub.onCall(3).rejects();
      stub.onCall(4).rejects();
      stub.onCall(5).rejects();
      stub.onCall(6).rejects();
      stub.onCall(7).rejects();
      stub.onCall(8).resolves(testConfig.testHash);
      let hash;
      try {
        hash = await vm.payGas(swtSecret, "", "1", "jmoac", {});
      } finally {
        expect(stub.callCount).toBe(9);
        expect(hash).toBe(testConfig.testHash);
      }
    });

    it("reject error if try 10 & always failed", async function() {
      const stub = sandbox.stub(vm, "transfer");
      stub.onCall(0).rejects();
      stub.onCall(1).rejects();
      stub.onCall(2).rejects();
      stub.onCall(3).rejects();
      stub.onCall(4).rejects();
      stub.onCall(5).rejects();
      stub.onCall(6).rejects();
      stub.onCall(7).rejects();
      stub.onCall(8).rejects();
      stub.onCall(9).rejects();
      try {
        await vm.payGas(swtSecret, "", "1", "jmoac", {});
      } catch (error) {
        expect(error.message).toBe("提币失败，请稍后再试！");
        expect(stub.callCount).toBe(10);
      }
    });
  });
});