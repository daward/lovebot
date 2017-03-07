let CardDeck = require("card-deck");
let cardtypes = require("./model/cardtypes");
let _ = require("lodash");

module.exports = () => {
  // go through each card type definition
  var cardInstances = _.map(cardtypes, cardtype => {
    // drop a card in for each quantity
    var instances = [];
    _.times(cardtype.quantity, num => {
      var card = new cardtype.card();
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