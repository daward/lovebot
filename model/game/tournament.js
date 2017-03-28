let Match = require("./match");
let _ = require("lodash");
const P = require("bluebird");

class Tournament {
  constructor(strategies, numberOfMatches, gamesPerMatch) {
    this.strategies = strategies;
    let num = 0;
    this.numberOfMatches = numberOfMatches;
    this.gamesPerMatch = gamesPerMatch;
    this.matches = [];
  }

  play() {
    let promise = P.resolve();
    _.times(this.numberOfMatches, () => this.matches.push(new Match(this.strategies, this.gamesPerMatch)));

    // I think if we deep-clone the players once it would allow for doing this concurrently,
    // and I could used Promise.all([promises]) to wait for them, but for now chain the promises.
    _.forEach(this.matches, match => promise = promise.then(() => match.play()));
    return promise;
  }

  listWinners() {
    return _.map(this.matches, match => {
      let winnerId = match.winner();
      return _.find(match.players, player => player.id === winnerId);
    });
  }

  report() {
    let winners = _.map(this.listWinners(), winner => JSON.stringify({
      name: winner.id,
      type: winner.uniqueId
    }));
    let standings = _.map(_.groupBy(winners), (value, key) => {
      let data = JSON.parse(key);
      return { 
        playerId: data.name,
        playerType: data.type, 
        matchWinPct: value.length / this.numberOfMatches, 
        matchesWon: value.length 
      };
    });

    standings = _.sortBy(standings, p => p.matchWinPct * -1);
    let place = 1;
    _.each(standings, p => p.place = place++);

    return {
      gameParameters: {
        numberOfMatches: this.matches.length,
        gamesPerMatch: this.gamesPerMatch,
        totalGames: _.sumBy(this.matches, match => match.games.length)
      },
      standings: standings
    }
  }
}

module.exports = Tournament;