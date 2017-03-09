let _ = require("lodash");

class Prince {
  constructor() {
    this.value = 5;
    this.name = "prince";
  }

  play(player, opts) {
    this.opts = opts;
    if (!this.opts.target) {
      player.dropHand();
    } else {
      this.opts.target.dropHand();
    }
  }

  info() {
    return {
      name: this.name,
      value: this.value,
      target: _.get(this, "opts.target.number")
    };
  }
}

module.exports = Prince;