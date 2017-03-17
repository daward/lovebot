let runner = require('../tournamentrunner');

let runTournament = (req, res, next) => {
  // Set default values for the non-required properties
  let bodyParam = req.swagger.params.body;
  let body = bodyParam.value;
  
  body.numberOfMatches = body.numberOfMatches || bodyParam.schema.schema.properties.numberOfMatches.default;
  body.gamesPerMatch = body.gamesPerMatch || bodyParam.schema.schema.properties.gamesPerMatch.default;

  console.log("Game in progress:" + JSON.stringify(body));
  runner(body)
    .then(response => res.json(response))
    .then(() => console.log("game complete"))
    .catch(err => next(err));
};

module.exports = {
  runTournament: runTournament
};
