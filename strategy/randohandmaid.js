let _ = require("lodash");
let randomStatements = require("./randomstatements");
let cardtypes = require("../definitions/cardtypes");

module.exports = (player, opponents) => {

  // if the card requires information from the player to be played, do so here
  let cardParameters = (cardType) => {
    var opts = {};
    if (_.includes(cardType.fields, "target")) {
      opts.target = randomStatements.randOpponent(opponents, player);
    }

    if (_.includes(cardType.fields, "guess")) {
      opts.guess = randomStatements.randCardGuess();
    }

    return opts;
  };

  let move;
  if (_.includes(player.cards, "handmaid")) {
    move = {selected: "handmaid", cardParameters: cardParameters(cardtypes.handmaid)};
  } else {
    let selected = _.sample(_.filter(player.cards, card => card !== "princess"));
    move = {selected, cardParameters: cardParameters(cardtypes[selected])};
  }
  
  return Promise.resolve(move);
};