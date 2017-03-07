let _ = require("lodash");
let cardtypes = require("../model/cardtypes");

module.exports = (player, opponents, callback) => {

  var selected = _.sample(player.cards);
  let randOpponent = () => {
    return _.sample(_.filter(opponents, opponent => opponent.active && !opponent.protected));
  };

  let randCardGuess = () => {
    return _.sample(_.filter(cardtypes, type => type.card.name !== "Guard"));
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