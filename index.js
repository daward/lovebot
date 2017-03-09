let _ = require("lodash");
let random = require("./strategy/random");
let noprincess = require("./strategy/noprincess");
let goodguess = require("./strategy/goodguess");
let randohandmaid = require("./strategy/randohandmaid");
let Tournament = require('./model/game/tournament');
let HttpProxyStrategy = require('./strategy/httpproxy');

let playerapi = require('./playerapi/playerapi');
playerapi.start(true); // remove the parameter or set it to false to disable logging.

var httpStrategy = new HttpProxyStrategy("http://localhost:8080/api/takeTurn");

let strategies = [
    {name: 'goodguess-http', strategy: (player, opponents) => httpStrategy.strategy(player, opponents) },
    {name: 'random1', strategy: random},
    {name: 'random2', strategy: random},
    {name: 'random3', strategy: random},
];

let tournament = new Tournament(strategies, 50, 4);

tournament.play().then(() => {
    let report = tournament.report();
    console.log(report);
    process.exit();
});
