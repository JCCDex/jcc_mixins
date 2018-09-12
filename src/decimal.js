const isNumber = require('jcc_common').isNumber;

module.exports = {
    computed: {
        pairs() {
            return this.$store.getters.transactionPairs;
        },
        getPairConfig(pairs, base, counter) {
            let minAmount = 0;
            let isInteger = false;
            let priceDecimal = 0;
            let amountDecimal = 0;
            if (Array.isArray(pairs)) {
                let pair = pairs.find(pair => {
                    return pair.base.toLowerCase() === base.toLowerCase() && pair.counter.toLowerCase() === counter.toLowerCase()
                })
                if (pair) {
                    minAmount = pair.minAmount;
                    isInteger = pair.isInteger;
                    priceDecimal = pair.priceDecimal;
                    amountDecimal = pair.amountDecimal;
                }
            }
            return {
                minAmount,
                isInteger,
                priceDecimal,
                amountDecimal
            };
        },
        priceDecimal() {
            let config = this.getPairConfig(this.pairs, this.base, this.counter);
            let {
                priceDecimal
            } = config;
            priceDecimal = parseFloat(priceDecimal);
            if (!isNumber(priceDecimal)) {
                priceDecimal = 0;
            }
            return priceDecimal;
        },
        amountDecimal() {
            let config = this.getPairConfig(this.pairs, this.base, this.counter);
            let {
                amountDecimal
            } = config;
            amountDecimal = parseFloat(amountDecimal);
            if (!isNumber(amountDecimal)) {
                amountDecimal = 0;
            }
            return amountDecimal;
        }
    }
}