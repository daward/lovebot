let _ = require("lodash");
let lovebotPlayer = require("lovebotplayer");
let Tournament = require('./model/game/tournament');
let HttpProxyStrategy = require('./httpproxy');

lovebotPlayer.playerapi.start(true);
var httpStrategy = new HttpProxyStrategy("http://localhost:8080/api/takeTurn");

let strategies = [
  { name: 'goodguess-http', strategy: (player, opponents) => httpStrategy.strategy(player, opponents) },
  { name: 'random1', strategy: lovebotPlayer.random },
  { name: 'random2', strategy: lovebotPlayer.random },
  { name: 'random3', strategy: lovebotPlayer.random }
];

let tournament = new Tournament(strategies, 50, 4);

tournament.play().then(() => {
  let report = tournament.report();
  console.log(report);
  process.exit();
});
