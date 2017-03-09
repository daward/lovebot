let rp = require('request-promise')

class HttpProxyStrategy {
  constructor(uri) {
    this.uri = uri;
  }

  strategy(player, opponents) {
      return rp({
          uri: this.uri,
          method: "POST",
          json: true,
          body: { player, opponents }
      });
  }
}


module.exports = HttpProxyStrategy;