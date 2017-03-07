let Player = require('../player');
let Match = require("./match");
let _ = require("lodash");

class Tournament {
  constructor(strategies, numberOfMatches) {
    this.strategies = strategies;
    let num = 0;
    this.players = _.map(strategies, strategy => new Player(num++, strategy));
    this.numberOfMatches = numberOfMatches;
    this.matches = [];
  }

  play() {
    _.times(this.numberOfMatches, () => this.matches.push(new Match(this.players, 4)));
    _.forEach(this.matches, match => match.play());
  }

  listWinners() {
    return _.map(this.matches, match => match.winner());
  }

  report() {
    return _.map(_.groupBy(this.listWinners()), (value, key) => {
      return { playerId: key, wins: value.length / this.numberOfMatches };
    });
  }
}

module.exports = Tournament;