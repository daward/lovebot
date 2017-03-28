const Game = require("./game");
const _ = require("lodash");
const Player = require('../player');

class Match {
  constructor(strategies, matchSize) {
    this.strategies = _.shuffle(strategies);
    this.games = [];
    this.matchSize = matchSize;
    this.players = _.map(this.strategies, strategy => new Player(strategy));
  }

  play() {
    this.currentGame = new Game(this.players);
    return this.keepPlayingUntilWinner(this.currentGame.play());
  }

  keepPlayingUntilWinner(gamePromise) {
    return gamePromise.then(() => {
      this.games.push(this.currentGame);
      if (!this.winner()) {
        this.currentGame = new Game(this.players);
        return this.keepPlayingUntilWinner(this.currentGame.play());
      }
    });
  }

  winner() {
    let matchCounts = _.countBy(this.games, game => game.winner.id);
    return _.findKey(matchCounts, winCount => winCount >= this.matchSize);
  }
}

module.exports = Match;
