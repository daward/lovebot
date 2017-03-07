let _ = require("lodash");
let random = require("./strategy/random");
let noprincess = require("./strategy/noprincess");
let goodguess = require("./strategy/goodguess");
let Tournament = require('./model/tournament');

const numberOfPlayers = 4;

let strategies = [];
strategies.push(goodguess);
_.times(2, () => strategies.push(random));
strategies.push(noprincess);

let tournament = new Tournament(strategies, 10000);

tournament.play();
let winners = tournament.listWinners();
let winnerSet = _.map(_.groupBy(winners), (value, key) => {
  return { playerId: key, wins: value.length };
});
console.log(winnerSet);