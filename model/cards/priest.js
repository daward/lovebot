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
    this.result = opts.target.getHandCard();
  }
}

module.exports = Priest;