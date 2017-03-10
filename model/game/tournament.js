let Player = require('../player');
let Match = require("./match");
let _ = require("lodash");

class Tournament {
  constructor(strategies, numberOfMatches, gamesPerMatch) {
    this.strategies = strategies;
    let num = 0;
    this.players = _.map(strategies, strategy => new Player(strategy.name, strategy.strategy));
    this.numberOfMatches = numberOfMatches;
    this.gamesPerMatch = gamesPerMatch;
    this.matches = [];
  }

  play() {
    let promise = Promise.resolve();
    _.times(this.numberOfMatches, () => this.matches.push(new Match(this.players, this.gamesPerMatch)));

    // I think if we deep-clone the players once it would allow for doing this concurrently,
    // and I could used Promise.all([promises]) to wait for them, but for now chain the promises.
    _.forEach(this.matches, match => promise = promise.then(() => match.play()));
    return promise;
  }

  listWinners() {
    return _.map(this.matches, match => match.winner());
  }

  report() {
    let report = _.map(_.groupBy(this.listWinners()), (value, key) => {
      return { playerId: key, matchWinPct: value.length / this.numberOfMatches, matchesWon: value.length };
    });

    report = _.sortBy(report, p => p.matchWinPct * -1);

    return _.concat(
      [{ matches: this.matches.length, gamesPerMatch: this.gamesPerMatch, totalGames: this.gamesPerMatch * this.matches.length }],
      report);
  }
}

module.exports = Tournament;