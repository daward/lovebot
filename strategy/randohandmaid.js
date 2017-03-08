let _ = require("lodash");
let randomStatements = require("./randomstatements");
let cardtypes = require("../definitions/cardtypes");

module.exports = (player, opponents, callback) => {

  // if the card requires information from the player to be played, do so here
  var cardParameters = (cardType) => {
    var opts = {};
    if (_.includes(cardType.fields, "target")) {
      opts.target = randomStatements.randOpponent(opponents, player);
    }

    if (_.includes(cardType.fields, "guess")) {
      opts.guess = randomStatements.randCardGuess();
    }

    return opts;
  };

  if (_.includes(player.cards, "handmaid")) {
    callback("handmaid", cardParameters(cardtypes.handmaid));
  } else {
    let selected = _.sample(_.filter(player.cards, card => card !== "princess"));
    callback(selected, cardParameters(cardtypes[selected]));
  }
};