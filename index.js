let lovebotPlayer = require("lovebotplayer");
let Tournament = require('./model/game/tournament');

// This file is essentially for testing now, I think the API shoudl be easier to use
// when testing an AI API. 

let promisify = strategy => (player, opponent) => Promise.resolve(strategy(player, opponent));

let strategies = [
  { name: "Good Guess", strategy: promisify(lovebotPlayer.goodguess) },
  { name: "No Princess", strategy: promisify(lovebotPlayer.noprincess) },
  { name: "Random 1", strategy: promisify(lovebotPlayer.random) },
  { name: "Random 2", strategy: promisify(lovebotPlayer.random) }
];

let numberOfMatches = 300;
let gamesPerMatch = 4;
let tournament = new Tournament(strategies, numberOfMatches, gamesPerMatch);

tournament.play().then(() => {
  let report = tournament.report();
  console.log(report);
  process.exit();
<<<<<<< HEAD
});
=======
});


>>>>>>> aef643dbbe74580bbbb7d32024e79c5baf364372
