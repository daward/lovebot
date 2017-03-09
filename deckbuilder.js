let CardDeck = require("card-deck");
let cardtypes = require("lovebotplayer").cardtypes;
let _ = require("lodash");

module.exports = () => {
  // go through each card type definition
  var cardInstances = _.map(cardtypes, (value, key) => {
    // drop a card in for each quantity
    var instances = [];
    _.times(value.quantity, num => {
      let CardDefinition = require("./model/cards/" + key);
      var card = new CardDefinition();
      card.id = num;
      instances.push(card);
    });
    return instances;
  });

  var deck = new CardDeck(_.flatten(cardInstances));
  deck.shuffle();
  deck.secretCard = deck.draw();
  return deck;
};