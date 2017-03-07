let _ = require("lodash");
let cardtypes = require("../definitions/cardtypes");

module.exports = (player, opponents, callback) => {

  var selected = _.sample(player.cards);
  let randOpponent = () => {
    return _.sample(_.filter(opponents, opponent => opponent.active && !opponent.protected));
  };

  let randCardGuess = () => {
    return _.sample(_.filter(cardtypes, type => type !== "guard"));
  };

  // if the card requires information from the player to be played, do so here
  var cardParameters = (cardType) => {
    var opts = {};
    if (_.includes(cardType.fields, "target")) {
      opts.target = randOpponent();
    }

    if (_.includes(cardType.fields, "guess")) {
      opts.guess = randCardGuess();
    }

    return opts;
  };

  callback(selected, cardParameters(cardtypes[selected.name]));
};