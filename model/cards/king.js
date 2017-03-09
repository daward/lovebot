let _ = require("lodash");

class King {
  constructor() {
    this.value = 6;
    this.name = "king";
  }

  play(player, opts) {
    this.opts = opts;
    if (!this.opts.target) {
      return;
    }
    player.swapHand(opts.target);
  }

  info(includePrivate) {
    return {
      name: this.name,
      value: this.value,
      target: _.get(this, "opts.target.number")
    };
  }
}

module.exports = King;