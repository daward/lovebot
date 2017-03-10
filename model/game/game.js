let Player = require("../player");
let _ = require("lodash");

class Game {
  constructor(players) {
    this.players = players;
    this.currentPlayerId = _.random(players.length - 1);
    this.deck = require("../../deckbuilder")();
  }

  deal() {
    _.forEach(this.players, player => player.startGame(this.deck));
    // This might end up being an API call, so lets keep it promisy
    return Promise.resolve();
  }

  playRound() {
    return this.currentPlayer().play(this.opponents())
      .then(() => this.goToNextPlayer());
  }

  opponents() {
    var currentPlayer = this.currentPlayer();
    // list all the opponents that aren't you
    return _.filter(this.players, player => player !== currentPlayer);
  }

  goToNextPlayer() {
    do {
      this.currentPlayerId = (this.currentPlayerId + 1) % this.players.length;
    } while (!this.currentPlayer().active);
  }

  currentPlayer() {
    return this.players[this.currentPlayerId];
  }

  play() {
    return this.deal().then(() => this.keepPlayingUntilWinner(this.playRound()));
  }

  keepPlayingUntilWinner(roundResult) {
    return roundResult.then(() => {
      if (!(this.winner = this.declareWinner())) {
        return this.keepPlayingUntilWinner(this.playRound());
      }
    })
  }

  declareWinner(deck) {
    var activePlayers = _.filter(this.players, player => player.active);
    if (activePlayers.length === 1) {
      return activePlayers[0];
    } else if (!this.deck.remaining()) {

      // break into groups by value so we can assess ties
      var groups = _.groupBy(activePlayers, player => player.getHandCard().value);

      // pull the highest scoring group to the top
      var highCardPlayers = _.reverse(_.map(groups, (value, key) => {
        return { value: value, key: key };
      }))[0].value;

      // there is no tie between cards, the highest is the winner!
      if (highCardPlayers.length === 1) {
        return highCardPlayers[0];
      }
      // there is a tie in hand cards, now we have to sum up plays, if
      // thats a tie, higher player wins (almost never happens)
      else {
        return _.maxBy(highCardPlayers, player => player.getPlaysTotalValue());
      }
    }
  }
}

module.exports = Game;