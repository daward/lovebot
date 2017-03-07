let _ = require("lodash");
let cardtypes = require("../model/cardtypes");

module.exports = (player, opponents, callback) => {

  var selected = _.sample(_.filter(player.cards, card => card.name !== "Princess"));
  let randOpponent = () => {
    return _.sample(_.filter(opponents, opponent => opponent.active && !opponent.protected));
  };

  let randCardGuess = () => {
    let choices = cardsLeft();
    return _.sample(_.filter(choices, type => type !== "Guard"));
  };

  let cardsLeft = () => {
    let opponentPlays = _.flatten(_.map(opponents, opponent => opponent.plays));
    let plays = _.concat(opponentPlays, player.plays, player.cards);
    let cardsPlayed = _.countBy(plays, play => play.name);

    let tempTypes = _.cloneDeep(cardtypes);

    _.forIn(cardsPlayed, (value, key) => {
      let type = _.find(tempTypes, type => type.card.name === key);
      type.quantity = type.quantity - value;
    });

    let cardsRemaining = _.flatten(_.map(tempTypes, type => {
      let retVal = [];
      _.times(type.quantity, () => retVal.push(type.card.name));
      return retVal;
    }));

    return cardsRemaining;
  };
  
  var cardParameters = {
    Guard: () => {
      return {
        target: randOpponent(),
        guess: randCardGuess()
      };
    },
    Priest: () => {
      return {
        target: randOpponent()
      };
    },
    Baron: () => {
      return {
        target: randOpponent()
      };
    },
    Prince: () => {
      // note, the target here doesn't have to be an opponent
      return {
        target: randOpponent()
      };
    },
    King: () => {
      return {
        target: randOpponent()
      };
    }
  };

  if(cardParameters[selected.name]) {
    callback(selected, cardParameters[selected.name]());
  } else {
    callback(selected);
  }
};