let _ = require("lodash");

class Priest {
  constructor() {
    this.value = 2;
    this.name = "priest";
  }

  play(player, opts) {
    this.opts = opts;
    // nobody targetted, presumably because there was nobody to target
    // (should be validated)
    if (!this.opts.target) {
      return;
    }
    this.privateResult = opts.target.getHandCard();
  }

  info(includePrivate) {
    let retVal = {
      name: this.name,
      value: this.value,
      target: _.get(this, "opts.target.id")
    };

    if(includePrivate) {
      retVal.result = this.privateResult;
    }

    return retVal;
  }
}

module.exports = Priest;