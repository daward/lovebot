let _ = require("lodash");
let lovebotPlayer = require("lovebotplayer");
let Tournament = require('./model/game/tournament');
let HttpProxyStrategy = require('./httpproxy');
let rando = (p, o) => Promise.resolve(lovebotPlayer.random(p, o));

lovebotPlayer.start({ enableLogging: true });
var httpStrategy = new HttpProxyStrategy("http://localhost:8080/api/strategies/0");

let strategies = [
  { name: 'goodguess-http', strategy: (player, opponents) => httpStrategy.strategy(player, opponents) },
  { name: 'random1', strategy: rando },
  { name: 'random2', strategy: rando },
  { name: 'random3', strategy: rando }
];

let tournament = new Tournament(strategies, 50, 4);

tournament.play().then(() => {
  let report = tournament.report();
  console.log(report);
  process.exit();
}).catch(err => console.log(err));
