let _ = require("lodash");
let lovebotPlayer = require("lovebotplayer");
let Tournament = require('../model/game/tournament');
let HttpProxyStrategy = require('../httpproxy');

// Called by the gamerunner api controller
module.exports = {
  runGame: runGame
};

function runGame(request) {
  let strategies = createStrategies(request.players);
  let tournament = new Tournament(strategies, request.numberOfMatches, request.gamesPerMatch);

  return tournament.play().then(() => {
    let report = tournament.report();
    return report;
  });
}

// Given the "players" specified by the requrest to run a game,
// create the strategies array needed for the tournament class.
function createStrategies(players) {
  let strats = [];

  _.each(players, p => {
    let strat = { name: p.name };

    if (p.aiType === "httpproxy") {
      if (!p.strategyUri) {
        throw new Error("You must send a strategyUri for players of type 'httpproxy'");
      }
      let proxy = new HttpProxyStrategy(p.strategyUri);
      strat.strategy = (a, b) => proxy.strategy(a, b);
    } else {
      strat.strategy = (a, b) => Promise.resolve(lovebotPlayer[p.aiType](a, b));
    }
    strats.push(strat);
  });

  return strats;
}