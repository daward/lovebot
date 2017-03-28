let _ = require('lodash');
let cardtypes = require("lovebotplayer").cardtypes;

class Player {
  constructor(strategy) {
    this.strategy = strategy.strategy;
    this.id = strategy.name;
    this.uniqueId = strategy.uniqueId;
    this.wins = 0;
  }

  startGame(deck, counter) {
    this.protected = false;
    this.active = true;
    this.cards = [];
    this.plays = [];
    this.deck = deck;
    this.draw();
    this.counter = counter;
  }

  draw(allowSecretCardDraw) {
    if (!this.deck.remaining() && allowSecretCardDraw) {
      this.cards.push(this.deck.secretCard);
    } else {
      this.cards.push(this.deck.draw());
    }
  }

  info(includePrivate, viewerId) {
    let retVal = {
      protected: this.protected,
      active: this.active,
      plays: this.playInfo(includePrivate, viewerId),
      id: this.id,
      wins: this.wins
    };
    if (includePrivate) {
      retVal.cards = _.map(this.cards, card => {
        let cardRetVal = { name: card.name };
        if (card.swap) {
          cardRetVal.swap = card.swap;
        }
        return cardRetVal;
      });
    }
    return retVal;
  }

  playInfo(includePrivate, viewerId) {

    // if we're omitting private information,
    // then we have to delete all private results
    return _.map(this.plays, play => {
      let retVal = play.info(includePrivate, viewerId);
      retVal.turn = play.turn;
      return retVal;
    });
  }

  play(opponents) {
    this.draw();
    let opponentPublicInfo = _.map(opponents, opponent => opponent.info(false, this.id));
    let playerInfo = this.info(true, this.id);

    // turns the identifier provided by the strategy back into an object
    // representing a card that that player actually holds
    let setCard = move => {
      let selected = _.find(this.cards, card => card.name === move.selected);
      if (!selected) {
        throw new Error(`Illegal move. The player currently does not have this card ${JSON.stringify(move)}`);
      }
      move.selected = selected;
    };

    return this.strategy(playerInfo, opponentPublicInfo)
      .then(move => {
        setCard(move);
        this.setTarget(opponents, move);
        this.applyMove(move);
      });
  }

  /**
   * Sets the target of a move to a complex object and verifies the move
   * is legal from a targetting perspective
   * @param {any} opponents - The set of players in the game
   * @param {any} move - The move proposed by the play strategy
   */
  setTarget(opponents, move) {

    let target = _.get(move, "cardParameters.target");

    if(target === this.id) {
      delete move.cardParameters.target;
      target = undefined;
    }

    // if a target was provided
    if (target && target !== this.id) {
      // find the player and make sure they are valid to target
      let targetPlayer = _.find(opponents, opponent => opponent.id === target);
      
      if (!targetPlayer.isValidTarget()) {
        throw new Error(`Invalid target selected ${target}`);
      }
      _.set(move, "cardParameters.target", targetPlayer);
      // if no target was provided, make sure its valid to null play or target yourself
    } else {
      let isTargettedPlay = _.includes(cardtypes[move.selected.name].fields, "target");
      if (isTargettedPlay && _.some(opponents, opponent => opponent.isValidTarget())) {
        throw new Error(`A target is required for the move: ${JSON.stringify(move)}`);
      }
    }
  }

  isValidTarget() {
    return this.active && !this.protected;
  }

  applyMove(move) {

    // we have to do apply the turn before the card is played
    // if it is the prince, we want to to be clear that the prince
    // was played first, so it has to happen before the card is activated
    move.selected.turn = this.counter();

    // if the card came from a king swap, that's not public information
    // and should not be part of the "play"
    delete move.selected.swap;

    // as soon as you play a card, whatever
    // protection had from a handmaid goes away
    this.protected = false;

    // take the card out of your hand
    _.remove(this.cards, move.selected);

    // execute the card
    move.selected.play(this, move.cardParameters);

    // then record that it happened
    this.plays.push(move.selected);
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

    if (handCard.name === cardtypes.princess.name) {
      this.kill();
    } else {
      this.nullPlay();
      this.draw(true);
    }
  }

  swapHand(opponent) {
    var myCard = this.getHandCard();
    var theirCard = opponent.getHandCard();
    myCard.swap = {
      source: this.id,
      previous: theirCard.name
    };

    theirCard.swap = {
      source: opponent.id,
      previous: myCard.name
    };

    opponent.cards = [myCard];
    this.cards = [theirCard];
  }

  getHandCard() {
    return this.cards[0];
  }

  nullPlay() {
    let card = this.getHandCard();
    delete card.swap;
    card.turn = this.counter();
    this.plays.push(card);
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