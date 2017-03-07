let _ = require("lodash");
let random = require("./strategy/random");
let noprincess = require("./strategy/noprincess");
let goodguess = require("./strategy/goodguess");
let Tournament = require('./model/game/tournament');

const numberOfPlayers = 4;

let strategies = [];
strategies.push(goodguess);
_.times(2, () => strategies.push(random));
strategies.push(noprincess);

let tournament = new Tournament(strategies, 10000);

tournament.play();
let report = tournament.report();

console.log(report);