import fingateInstance from "@/src/deposit/instance";
const sinon = require("sinon");
const sandbox = sinon.createSandbox();
import CallFingate from "jcc-call-utils";
import BizainFingate from "jcc-bizain-utils";
import StreamFingate from "jcc-stream-utils";
import RippleFingate from "jcc-ripple-utils";

describe('deposit instance', () => {
  describe("test init", function() {
    it("should be inited if call instance isn't inited", async function() {
      const instance = await fingateInstance.init("call");
      const fingate = instance.callFingateInstance;
      expect(fingate instanceof CallFingate).toBe(true);
    })

    it("should be inited once if call instance is inited", async function() {
      const instance = await fingateInstance.init("call");
      const fingate = instance.callFingateInstance;
      const instance1 = await fingateInstance.init("call");
      const fingate1 = instance1.callFingateInstance;
      expect(fingate).toBe(fingate1);
    })

    it("should be inited if ripple instance isn't inited", async function() {
      const instance = await fingateInstance.init("ripple");
      const fingate = instance.rippleFingateInstance;
      expect(fingate instanceof RippleFingate).toBe(true);
    })

    it("should be inited once if ripple instance is inited", async function() {
      const instance = await fingateInstance.init("ripple");
      const fingate = instance.rippleFingateInstance;
      const instance1 = await fingateInstance.init("ripple");
      const fingate1 = instance1.rippleFingateInstance;
      expect(fingate).toBe(fingate1);
    })

    it("should be inited if bizain instance isn't inited", async function() {
      const instance = await fingateInstance.init("bizain");
      const fingate = instance.bizainFingateInstance;
      expect(fingate instanceof BizainFingate).toBe(true);
    })

    it("should be inited once if bizain instance is inited", async function() {
      const instance = await fingateInstance.init("bizain");
      const fingate = instance.bizainFingateInstance;
      const instance1 = await fingateInstance.init("bizain");
      const fingate1 = instance1.bizainFingateInstance;
      expect(fingate).toBe(fingate1);
    })

    it("should be inited if stream instance isn't inited", async function() {
      const instance = await fingateInstance.init("stream");
      const fingate = instance.stmFingateInstance;
      expect(fingate instanceof StreamFingate).toBe(true);
    })

    it("should be inited once if stream instance is inited", async function() {
      const instance = await fingateInstance.init("stream");
      const fingate = instance.stmFingateInstance;
      const instance1 = await fingateInstance.init("stream");
      const fingate1 = instance1.stmFingateInstance;
      expect(fingate).toBe(fingate1);
    })
  })

  describe("test initWithContract", function() {

    describe("test moac", function() {
      const { Moac, Fingate, ERC20 } = require("jcc-moac-utils");
      const node = "http://localhost";
      const scAddress = "0x66c9b619215db959ec137ede6b96f3fa6fd35a8a";
      const contract = "0x4c6007cea426e543551f2cb6392e6d6768f74706"

      afterEach(() => {
        fingateInstance.destroy()
      })

      it("should be inited if instance isn't inited and contract isn't empty", async function() {
        const instance = await fingateInstance.initWithContract("moac", node, scAddress, contract);
        const { moacInstance, moacFingateInstance, moacERC20Instance } = instance;
        expect(moacInstance instanceof Moac).toBe(true);
        expect(moacFingateInstance instanceof Fingate).toBe(true);
        expect(moacERC20Instance instanceof ERC20).toBe(true);

        const instance1 = await fingateInstance.initWithContract("moac", node, scAddress, contract);
        expect(moacInstance).toBe(instance1.moacInstance);
        expect(moacFingateInstance).toBe(instance1.moacFingateInstance);
        expect(moacERC20Instance).toBe(instance1.moacERC20Instance);

        instance.moacFingateInstance = undefined;
        const instance2 = await fingateInstance.initWithContract("moac", node, scAddress, contract);

        expect(moacInstance).toBe(instance1.moacInstance);
        expect(moacFingateInstance).not.toBe(instance2.moacFingateInstance);
        expect(moacERC20Instance).toBe(instance1.moacERC20Instance);

        instance2.moacERC20Instance = undefined;
        const instance3 = await fingateInstance.initWithContract("moac", node, scAddress, contract);

        expect(moacERC20Instance).not.toBe(instance3.moacERC20Instance);

        const instance4 = await fingateInstance.initWithContract("moac", node, scAddress, "0x86Fa049857E0209aa7D9e616F7eb3b3B78ECfdb0");
        expect(moacERC20Instance).not.toBe(instance4.moacERC20Instance);
        expect(instance4.moacERC20Instance._address).toBe("0x86Fa049857E0209aa7D9e616F7eb3b3B78ECfdb0");
      })

      it("should be inited if instance isn't inited and contract is empty", async function() {
        const instance = await fingateInstance.initWithContract("moac", node, scAddress);
        const { moacInstance, moacFingateInstance, moacERC20Instance } = instance;
        expect(moacInstance instanceof Moac).toBe(true);
        expect(moacFingateInstance instanceof Fingate).toBe(true);
        expect(moacERC20Instance).toBe(undefined);
      })
    })

    describe("test ethereum", function() {
      const { Ethereum, Fingate, ERC20 } = require("jcc-ethereum-utils");
      const node = "http://localhost";
      const scAddress = "0x3907acb4c1818adf72d965c08e0a79af16e7ffb8";
      const contract = "0x9BD4810a407812042F938d2f69f673843301cfa6";

      afterEach(() => {
        fingateInstance.destroy()
      })

      it("should be inited if instance isn't inited and contract isn't empty", async function() {
        const instance = await fingateInstance.initWithContract("ethereum", node, scAddress, contract);
        const { ethereumInstance, ethereumFingateInstance, ethereumERC20Instance } = instance;
        expect(ethereumInstance instanceof Ethereum).toBe(true);
        expect(ethereumFingateInstance instanceof Fingate).toBe(true);
        expect(ethereumERC20Instance instanceof ERC20).toBe(true);

        const instance1 = await fingateInstance.initWithContract("ethereum", node, scAddress, contract);
        expect(ethereumInstance).toBe(instance1.ethereumInstance);
        expect(ethereumERC20Instance).toBe(instance1.ethereumERC20Instance);
        expect(ethereumFingateInstance).toBe(instance1.ethereumFingateInstance);

        instance.ethereumFingateInstance = undefined;
        const instance2 = await fingateInstance.initWithContract("ethereum", node, scAddress, contract);

        expect(ethereumInstance).toBe(instance2.ethereumInstance);
        expect(ethereumERC20Instance).toBe(instance2.ethereumERC20Instance);
        expect(ethereumFingateInstance).not.toBe(instance2.ethereumFingateInstance);

        instance2.ethereumERC20Instance = undefined;
        const instance3 = await fingateInstance.initWithContract("ethereum", node, scAddress, contract);

        expect(ethereumERC20Instance).not.toBe(instance3.ethereumERC20Instance);

        const instance4 = await fingateInstance.initWithContract("ethereum", node, scAddress, "0x86Fa049857E0209aa7D9e616F7eb3b3B78ECfdb0");
        expect(ethereumERC20Instance).not.toBe(instance4.ethereumERC20Instance);
        expect(instance4.ethereumERC20Instance._address).toBe("0x86Fa049857E0209aa7D9e616F7eb3b3B78ECfdb0");
      })

      it("should be inited if instance isn't inited and contract is empty", async function() {
        const instance = await fingateInstance.initWithContract("ethereum", node, scAddress);
        const { ethereumInstance, ethereumFingateInstance, ethereumERC20Instance } = instance;
        expect(ethereumInstance instanceof Ethereum).toBe(true);
        expect(ethereumFingateInstance instanceof Fingate).toBe(true);
        expect(ethereumERC20Instance).toBe(undefined);
      })
    })

  })
})