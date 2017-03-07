class Guard {
  constructor() {
    this.value = 1;
    this.name = "guard";
  }

  play(player, opts) {
    this.opts = opts;

    // nobody targetted, presumably because there was nobody to target
    // (should be validated)
    if(!this.opts.target) {
      return;
    }
    if(this.opts.target.cards[0].name === this.opts.guess) {
      this.opts.target.kill();
    }
  }
}

module.exports = Guard;