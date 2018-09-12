const {
    isNumber,
    toThousandSeperator,
    scientificToDecimal
} = require('jcc_common');
const Vue = require('vue');

const formatNumber = (num, decimal, thousands = false) => {
    num = parseFloat(num);
    if (!isNumber(num)) {
        return '--';
    }
    if (isNumber(decimal)) {
        num = num.toFixed(decimal);
        if (decimal > 2) {
            num = parseFloat(num);
        }
    }
    num = scientificToDecimal(num);
    if (thousands) {
        num = toThousandSeperator(num.toString());
    }
    return num;
}

const bus = new Vue();

module.exports = {
    formatNumber,
    bus
}