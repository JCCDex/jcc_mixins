const BigNumber = require('bignumber.js');
const {
    isNumber,
    isEmptyObject
} = require('jcc_common');
const formatNumber = require('./utils').formatNumber
module.exports = {
    data() {
        return {
            convertToCny: process.env.convertToCny,
            anchorCurrency: process.env.anchorCurrency
        }
    },
    computed: {
        coinmarketcapData() {
            return this.$store.getters.coinmarketcapData
        }
    },
    methods: {
        getTicker(token) {
            let datas = this.coinmarketcapData;
            if (Array.isArray(datas) && datas.length > 0) {
                let res = datas.find(data => {
                    return data.symbol.toLowerCase() === token.toLowerCase();
                });
                return res;
            }
            return null;
        },
        tickerPrice(token, currency = this.anchorCurrency.currency) {
            let data = this.getTicker(token.replace(/j/i, ''));
            let rate;
            if (data) {
                rate = data.quotes[currency].price;
            } else {
                rate = 0
            }
            return rate
        },
        getExchangeRate(counter) {
            counter = counter.toLowerCase();
            let rate = 0;
            if (counter === "ust") {
                rate = 6.7;
            } else if (counter === "cny") {
                rate = 1;
            } else if (counter === "swt") {
                rate = this.getBasePrice('cny');
            } else {
                rate = this.tickerPrice(counter);
            }
            rate = parseFloat(rate);
            return isNumber(rate) ? rate : '--';
        },
        // computed how much counter per base
        getBasePrice(counter, base = 'swt') {
            let marketList = this.$store.getters.marketList;
            if (isEmptyObject(marketList)) {
                return '--';
            }

            let datas = [];
            for (let key in marketList) {
                let data = marketList[key];
                if (Array.isArray(data)) {
                    datas = [...datas, ...data];
                }
            }
            if (datas.length === 0) {
                return '--';
            }
            let currentData = datas.find(data => {
                return data.base.toUpperCase() === base.toUpperCase() && counter.toLowerCase() === data.counter.toLowerCase();
            });
            if (!currentData) {
                return '--'
            }
            let price = parseFloat(currentData.price);
            return isNumber(price) ? price : '--';
        },
        getCounterPrice(counter, base = 'swt') {
            let price = this.getBasePrice(counter, base);
            return isNumber(1 / price) ? 1 / price : '--';
        },
        setPrice(price) {
            let sum;
            price = parseFloat(price);
            if (isNumber(price)) {
                let counter = this.counter.toUpperCase();
                price = parseFloat(price);
                let rate = this.getExchangeRate(counter);
                let base = this.base.toUpperCase();
                let decimal;
                if ((counter === "UST" || counter === "SWT") && base === "VCC") {
                    decimal = 2;
                } else if (counter === "JETH" && base === "SWT") {
                    decimal = 8;
                } else {
                    decimal = 6;
                }
                sum = new BigNumber(price).multipliedBy(rate);
                sum = sum.toString();

                if (!this.convertToCny) {
                    if (isNumber(price)) {
                        price = formatNumber(price, decimal);
                    } else {
                        price = "--";
                    }
                    sum = '--';
                } else {
                    if (isNumber(price) && isNumber(parseFloat(sum))) {
                        price = formatNumber(price, decimal);
                        sum = `${this.anchorCurrency.symbol}${formatNumber(sum, decimal)}`;
                    } else {
                        price = sum = "--";
                    }
                }
            } else {
                price = sum = "--";
            }
            this.currentPrice = {
                price,
                sum
            };
        }
    }
}