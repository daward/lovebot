let _ = require('lodash');

class Player {
  constructor(number, strategy) {
    this.strategy = strategy;
    this.number = number;
  }

  startGame(deck) {
    this.protected = false;
    this.active = true;
    this.cards = [];
    this.plays = [];
    this.deck = deck;
    this.draw();
  }

  draw(allowSecretCardDraw) {
    if (!this.deck.remaining() && allowSecretCardDraw) {
      this.cards.push(this.deck.secretCard);
    } else {
      this.cards.push(this.deck.draw());
    }
  }

  info(includePrivate) {
    let retVal = {
      protected: this.protected,
      active: this.active,
      plays: this.playInfo(includePrivate),
      number: this.number
    };
    if (includePrivate) {
      retVal.cards = _.map(this.cards, "name");
    }
    return retVal;
  }

  playInfo(includePrivate) {
    let retVal = _.cloneDeep(this.plays);

    // if we're omitting private information,
    // then we have to delete all private results
    if (!includePrivate) {
      _.forEach(retVal, info => {
        delete info.privateResult;
      });
    }
    return retVal;
  }

  play(opponents) {
    this.draw();
    let opponentPublicInfo = _.map(opponents, opponent => opponent.info(false));
    let playerInfo = this.info(true);
    let targetFinder = options => {
      if (options.target) {
        options.target = _.find(opponents, opponent => opponent.number === options.target);
      }
      return options;
    };

    let cardFinder = playedCard => {
      return _.find(this.cards, card => card.name === playedCard);
    };

    this.strategy(
      playerInfo,
      opponentPublicInfo,
      (playedCard, options) => this.applyCard(cardFinder(playedCard), targetFinder(options)));
  }

  isValidTarget() {
    return this.active && !this.protected;
  }

  applyCard(playedCard, options) {
    // as soon as you play a card, whatever
    // protection had from a handmaid goes away
    if (options && options.target && !options.target.isValidTarget()) {
      throw new Error("Invalid target selected");
    }
    this.protected = false;
    _.remove(this.cards, playedCard);
    playedCard.play(this, options);
    this.plays.push(playedCard);
  }

  /**
   * Effect when the prince is played.  Is a bit special
   * Because you need to immediately draw, and if there's nothing
   * in the deck, you get the trash card
   */
  dropHand() {
    // you card becomes "played", but you get no effect
    // and no information about it
    var handCard = this.getHandCard();

    if (handCard.name === "Princess") {
      this.kill();
    } else {
      this.nullPlay();
      this.draw(true);
    }
  }

  swapHand(opponent) {
    var myCard = this.getHandCard();
    var theirCard = opponent.getHandCard();
    opponent.cards = [myCard];
    this.cards = [theirCard];
  }

  getHandCard() {
    return this.cards[0];
  }

  nullPlay() {
    this.plays.push(this.getHandCard());
    this.cards = [];
  }

  kill() {
    this.nullPlay();
    this.active = false;
  }

  getPlaysTotalValue() {
    return _.sumBy(this.plays, play => play.value);
  }
}

module.exports = Player;