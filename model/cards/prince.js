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
}

module.exports = Prince;