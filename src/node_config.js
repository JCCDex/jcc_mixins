module.exports = {
  computed: {
    hosts() {
      return this.$store.getters.hosts
    },
    bizHosts() {
      if (process.env.proxy) {
        return [];
      }
      return this.hosts.bizHosts.length > 0 ? this.hosts.bizHosts : process.env.bizHosts
    },
    exHosts() {
      if (process.env.proxy) {
        return [];
      }
      return this.hosts.exHosts.length > 0 ? this.hosts.exHosts : process.env.exHosts
    },
    infoHosts() {
      if (process.env.proxy) {
        return [];
      }
      return this.hosts.infoHosts.length > 0 ? this.hosts.infoHosts : process.env.infoHosts
    },
    cfgHosts() {
      if (process.env.proxy) {
        return [];
      }
      return this.hosts.cfgHosts.length > 0 ? this.hosts.cfgHosts : process.env.cfgHosts
    },
    jcNodes() {
      if (process.env.proxy) {
        return [];
      }
      return this.hosts.jcNodes.length > 0 ? this.hosts.jcNodes : process.env.jcNodes
    },
    https() {
      return process.env.NODE_ENV === 'production'
    },
    bizPort() {
      return this.https ? 443 : process.env.bizPort
    },
    exPort() {
      return this.https ? 443 : process.env.exPort
    },
    infoPort() {
      return this.https ? 443 : process.env.infoPort
    },
    cfgPort() {
      return this.https ? 443 : process.env.cfgPort
    }
  }
}