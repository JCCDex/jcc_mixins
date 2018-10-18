const {
    isNumber
} = require('jcc_common');
module.exports = {
    methods: {
        isNumber(value) {
            return isNumber(parseFloat(value));
        }
    },
    computed: {
        marketList() {
            return this.$store.getters.marketList;
        },
        pairData() {
            let marketList = this.marketList;
            let pairData = {};
            for (let key in marketList) {
                let datas = marketList[key];
                if (Array.isArray(datas)) {
                    let data = datas.find(data => {
                        return (
                            data.base.toUpperCase() === this.base.toUpperCase() &&
                            data.counter.toUpperCase() === this.counter.toUpperCase()
                        );
                    });
                    if (data) {
                        pairData = data;
                        break;
                    }
                }
            }
            return pairData;
        },
        highest() {
            let highest = parseFloat(this.pairData.highest);
            return isNumber(highest) ? highest : '--'
        },
        lowest() {
            let lowest = parseFloat(this.pairData.lowest);
            return isNumber(lowest) ? lowest : '--';
        },
        rate() {
            let rate = parseFloat(this.pairData.rate);
            return isNumber(rate) ? rate : 0;
        },
        ratePercent() {
            let rate = this.rate;
            if (!isNumber(rate) || rate === 0) {
                return "--";
            }
            if (rate > 0) {
                return "+" + rate.toFixed(2) + "%";
            }
            return rate.toFixed(2) + "%";
        },
        price() {
            let price = parseFloat(this.pairData.price);
            if (!isNumber(price)) {
                price = "--";
            }
            return price;
        },
        volume24() {
            let volume24 = parseFloat(this.pairData.volume24);
            return isNumber(volume24) ? volume24 : '--';
        }
    }
};