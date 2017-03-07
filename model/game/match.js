let Game = require("./game");
let _ = require("lodash");

class Match {
  constructor(players, matchSize) {
    this.players = players;
    this.games = [];
    this.matchSize = matchSize;
  }

  play() {
    do {
      let currentGame = new Game(this.players);
      currentGame.play();
      this.games.push(currentGame);
    } while(!this.winner());
  }

  winner() {
    let matchCounts = _.countBy(this.games, game => game.winner.number);
    return _.findKey(matchCounts, winCount => winCount >= this.matchSize);
  }
}

module.exports = Match;