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
}

module.exports = King;