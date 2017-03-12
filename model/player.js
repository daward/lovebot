let _ = require('lodash');

class Player {
  constructor(id, strategy) {
    this.strategy = strategy;
    this.id = id;
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
      id: this.id
    };
    if (includePrivate) {
      retVal.cards = _.map(this.cards, card => {
        let cardRetVal = { name: card.name };
        if (card.source) {
          cardRetVal.source = card.source;
        }
        return cardRetVal;
      });
    }
    return retVal;
  }

  playInfo(includePrivate) {

    // if we're omitting private information,
    // then we have to delete all private results
    return _.map(this.plays, play => play.info(includePrivate));
  }

  play(opponents) {
    this.draw();
    let opponentPublicInfo = _.map(opponents, opponent => opponent.info(false));
    let playerInfo = this.info(true);
    let targetFinder = options => {
      if (options.target) {
        options.target = _.find(opponents, opponent => opponent.id === options.target);
      }
      return options;
    };

    let cardFinder = playedCard => {
      return _.find(this.cards, card => card.name === playedCard);
    };

    return this.strategy(playerInfo, opponentPublicInfo)
      .then(move => this.applyCard(cardFinder(move.selected), targetFinder(move.cardParameters)));
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
    myCard.source = this.id;
    var theirCard = opponent.getHandCard();
    theirCard.source = opponent.id;
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