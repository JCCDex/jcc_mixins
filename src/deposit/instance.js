const fingateInstance = (() => {
  let obj = {};

  const init = (chain) => {
    return new Promise((resolve, reject) => {
      if (chain === "call" && !obj.callFingateInstance) {
        import("jcc-call-utils").then(m => {
          const CallFingate = m.CallFingate;
          const callFingateInstance = new CallFingate("wss://s1.callchain.live:5020");
          obj = { callFingateInstance }
          return resolve(obj);
        })
      } else if (chain === "ripple" && !obj.rippleFingateInstance) {
        import("jcc-ripple-utils").then(m => {
          const RippleFingate = m.RippleFingate;
          const rippleFingateInstance = new RippleFingate('wss://s1.ripple.com');
          obj = {
            rippleFingateInstance
          }
          return resolve(obj);
        })
      } else if (chain === "stream" && !obj.stmFingateInstance) {
        import("jcc-stream-utils").then(m => {
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
          return resolve(obj);
        })
      } else if (chain === "bizain" && !obj.bizainFingateInstance) {
        import("jcc-bizain-utils").then(m => {
          const BizainFingate = m.BizainFingate;
          const bizainFingateInstance = new BizainFingate('wss://bizain.net/bc/ws');
          bizainFingateInstance.init();
          obj = {
            bizainFingateInstance
          }
          return resolve(obj);
        })
      } else {
        return resolve(obj);
      }
    })
  }

  const initWithContract = (chain, node, scAddress, contract) => {
    return new Promise((resolve, reject) => {
      /* istanbul ignore else */
      if (chain === "moac") {
        import("jcc-moac-utils").then(m => {
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
        })
      } else if (chain === "ethereum") {
        import("jcc-ethereum-utils").then(m => {
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
        })
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