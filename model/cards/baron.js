let _ = require("lodash");

class Baron {
  constructor() {
    this.value = 3;
    this.name = "Baron";
  }

  play(player, opts) {
    this.opts = opts;
    // nobody targetted, presumably because there was nobody to target
    // (should be validated)
    if (!this.opts.target) {
      return;
    }
    var attackCard = player.getHandCard(this);
    var targetCard = this.opts.target.getHandCard();
    if (attackCard.value > targetCard.value) {
      this.result = "success";
      this.opts.target.kill();
    } else if (attackCard.value < targetCard.value) {
      this.result = "fail";
      player.kill();
    } else {
      this.result = "draw";
    }
  }
}

module.exports = Baron;