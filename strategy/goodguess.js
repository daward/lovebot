let _ = require("lodash");
let cardsLeft = require("./cardsremaining");
let cardtypes = require("../definitions/cardtypes");

module.exports = (player, opponents, callback) => {

  var selected = _.sample(_.filter(player.cards, card => card.name !== "princess"));
  let randOpponent = () => {
    return _.sample(_.filter(opponents, opponent => opponent.active && !opponent.protected));
  };

  let randCardGuess = () => {
    let choices = cardsLeft(opponents, player);
    return _.sample(_.filter(choices, type => type !== "guard"));
  };

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