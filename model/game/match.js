let Game = require("./game");
let _ = require("lodash");

class Match {
  constructor(players, matchSize) {
    this.players = players;
    this.games = [];
    this.matchSize = matchSize;
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
    let matchCounts = _.countBy(this.games, game => game.winner.number);
    return _.findKey(matchCounts, winCount => winCount >= this.matchSize);
  }
}

module.exports = Match;
