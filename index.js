let _ = require("lodash");
let random = require("./strategy/random");
let noprincess = require("./strategy/noprincess");
let goodguess = require("./strategy/goodguess");
let randohandmaid = require("./strategy/randohandmaid");
let Tournament = require('./model/game/tournament');

const numberOfPlayers = 4;

let strategies = [];
strategies.push(randohandmaid);
_.times(3, () => strategies.push(noprincess));
//strategies.push(noprincess);

let tournament = new Tournament(strategies, 1000);

tournament.play();
let report = tournament.report();

console.log(report);