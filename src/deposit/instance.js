const fingateInstance = (() => {
  let obj = {};
  const getModule = (libName) => {
    return new Promise((resolve, reject) => {
      import(libName).then(lib => {
        return resolve(lib);
      })
    })
  }

  const init = (chain) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (chain === "call" && !obj.callFingateInstance) {
          const m = await getModule("jcc-call-utils");
          const CallFingate = m.CallFingate;
          const callFingateInstance = new CallFingate("wss://s1.callchain.live:5020");
          obj = { callFingateInstance }
        } else if (chain === "ripple" && !obj.rippleFingateInstance) {
          const m = await getModule("jcc-ripple-utils");
          const RippleFingate = m.RippleFingate;
          const rippleFingateInstance = new RippleFingate('wss://s1.ripple.com');
          obj = {
            rippleFingateInstance
          }
        } else if (chain === "stream" && !obj.stmFingateInstance) {
          const m = await getModule("jcc-stream-utils");
          const StreamFingate = m.StreamFingate;
          const stmFingateInstance = new StreamFingate({
            host: 'nodew.labs.stream',
            port: 443,
            secure: true
          });
          stmFingateInstance.init();
          obj = {
            stmFingateInstance
          }
        } else if (chain === "bizain" && !obj.bizainFingateInstance) {
          const m = await getModule("jcc-bizain-utils");
          const BizainFingate = m.BizainFingate;
          const bizainFingateInstance = new BizainFingate('wss://bizain.net/bc/ws');
          bizainFingateInstance.init();
          obj = {
            bizainFingateInstance
          }
        }
        return resolve(obj);
      } catch (error) {
        /* istanbul ignore next */
        return reject(error);
      }
    })
  }

  const initWithContract = (chain, node, scAddress, contract) => {
    return new Promise(async (resolve, reject) => {
      /* istanbul ignore else */
      if (chain === "moac") {
        try {
          const m = await getModule("jcc-moac-utils");
          if (!obj.moacInstance) {
            const Moac = m.Moac;
            const Fingate = m.Fingate;
            const moacInstance = new Moac(node, true);
            moacInstance.initChain3();
            const moacFingateInstance = new Fingate();
            moacFingateInstance.init(scAddress, moacInstance);
            obj = {
              moacInstance,
              moacFingateInstance
            }
            if (contract) {
              const ERC20 = m.ERC20;
              const moacERC20Instance = new ERC20();
              moacERC20Instance.init(contract, moacInstance);
              obj.moacERC20Instance = moacERC20Instance;
            }
          }

          if (!obj.moacFingateInstance) {
            const Fingate = m.Fingate;
            const moacFingateInstance = new Fingate();
            moacFingateInstance.init(scAddress, obj.moacInstance);
            obj.moacFingateInstance = moacFingateInstance;
          }

          if (contract && (!obj.moacERC20Instance || obj.moacERC20Instance._address !== contract)) {
            const ERC20 = m.ERC20;
            const moacERC20Instance = new ERC20();
            moacERC20Instance.init(contract, obj.moacInstance);
            obj.moacERC20Instance = moacERC20Instance;
          }
          return resolve(obj);
        } catch (error) {
          /* istanbul ignore next */
          return reject(error);
        }
      } else if (chain === "ethereum") {
        try {
          const m = await getModule("jcc-ethereum-utils");
          if (!obj.ethereumInstance) {
            const Ethereum = m.Ethereum;
            const Fingate = m.Fingate;
            const ethereumInstance = new Ethereum(node, true);
            ethereumInstance.initWeb3();
            const ethereumFingateInstance = new Fingate();
            ethereumFingateInstance.init(scAddress, ethereumInstance);
            obj = {
              ethereumInstance,
              ethereumFingateInstance
            }
            if (contract) {
              const ERC20 = m.ERC20;
              const ethereumERC20Instance = new ERC20();
              ethereumERC20Instance.init(contract, ethereumInstance);
              obj.ethereumERC20Instance = ethereumERC20Instance;
            }
          }

          if (!obj.ethereumFingateInstance) {
            const Fingate = m.Fingate;
            const ethereumFingateInstance = new Fingate();
            ethereumFingateInstance.init(scAddress, obj.ethereumInstance);
            obj.ethereumFingateInstance = ethereumFingateInstance;
          }

          if (contract && (!obj.ethereumERC20Instance || obj.ethereumERC20Instance._address !== contract)) {
            const ERC20 = m.ERC20;
            const ethereumERC20Instance = new ERC20();
            ethereumERC20Instance.init(contract, obj.ethereumInstance);
            obj.ethereumERC20Instance = ethereumERC20Instance;
          }
          return resolve(obj);
        } catch (error) {
          /* istanbul ignore next */
          return reject(error);
        }
      }
    })
  }

  const destroy = () => {
    obj = {};
  }

  return {
    destroy,
    init,
    initWithContract
  }
})();

export default fingateInstance;