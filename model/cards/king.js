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
    this.playerCard = player.getHandCard();
    this.targetCard = opts.target.getHandCard();
    player.swapHand(opts.target);
  }

  info(includePrivate, playerId) {
    let retVal =  {
      name: this.name,
      value: this.value,
      target: _.get(this, "opts.target.id")
    };

    if(includePrivate || playerId === _.get(this, "opts.target.id")) {
      retVal.targetCard = _.get(this, "targetCard.name");
      retVal.playerCard = _.get(this, "playerCard.name");
    }

    return retVal;
  }
}

module.exports = King;