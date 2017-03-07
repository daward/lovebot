let Player = require('./player');
let Game = require("./game");
let _ = require("lodash");

class Tournament {
  constructor(strategies, numberOfGames) {
    this.strategies = strategies;
    let num = 0;
    this.players = _.map(strategies, strategy => new Player(num++, strategy));
    this.numberOfGames = numberOfGames;
    this.games = [];
  }

  play() {
    _.times(this.numberOfGames, () => {
      this.games.push(new Game(this.players));
    });
    
    _.forEach(this.games, game => game.play());
  }

  listWinners() {
    return _.map(this.games, game => game.winner.number);
  }
}

module.exports = Tournament;