module.exports = {
  computed: {
    pairs() {
      return this.$store.getters.transactionPairs;
    },
    counterTitle() {
      if (!this.pairs) {
        return '';
      }
      let data = this.pairs.find(pair => {
        return pair.counter.toLowerCase() === this.counter.toLowerCase()
      });
      return data ? data.counterTitle.toUpperCase() : ''
    },
    baseTitle() {
      if (!this.pairs) {
        return '';
      }
      let data = this.pairs.find(pair => {
        return pair.base.toLowerCase() === this.base.toLowerCase()
      });
      return data ? data.baseTitle.toUpperCase() : '';
    }
  }
}