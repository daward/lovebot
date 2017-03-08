let _ = require("lodash");
let cardtypes = require("../definitions/cardtypes");
let randomStatements = require("./randomstatements");

module.exports = (player, opponents, callback) => {

  var selected = _.sample(_.filter(player.cards, card => card !== "princess"));

  let randCardGuess = () => {
    return _.sample(_.filter(_.keys(cardtypes), type => type !== "guard"));
  };

  var cardParameters = (cardType) => {
    var opts = {};
    if (_.includes(cardType.fields, "target")) {
      opts.target = randomStatements.randOpponent(opponents, player);
    }

    if (_.includes(cardType.fields, "guess")) {
      opts.guess = randCardGuess();
    }

    return opts;
  };

  callback(selected, cardParameters(cardtypes[selected]));
};