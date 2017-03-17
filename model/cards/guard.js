let _ = require("lodash");

class Guard {
  constructor() {
    this.value = 1;
    this.name = "guard";
  }

  info() {
    return {
      name: this.name,
      value: this.value,
      guess: _.get(this, "opts.guess"),
      target: _.get(this, "opts.target.id"),
      result: this.result
    };
  }

  play(player, opts) {
    this.opts = opts;

    // nobody targetted, presumably because there was nobody to target
    // (should be validated)
    if (!this.opts.target) {
      return;
    }
    if (this.opts.target.cards[0].name === this.opts.guess) {
      this.opts.target.kill();
      this.result = "success";
    } else {
      this.result = "fail";
    }
  }
}

module.exports = Guard;