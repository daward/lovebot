let path = require('path');
let fs = require('fs');
let _ = require('lodash');
let express = require('express');
let swaggerTools = require('swagger-tools');
let lovebotPlayer = require('lovebotplayer');

let port = process.env.PORT || 3333;
let playerApiPort = port - 1;

let app = express();

let swaggerDoc = require('./swagger.json');

let routerOptions = {
  controllers: path.join(__dirname, 'controllers')
}

// customize the default body of the POST /tournament request to be able
// to call into the locally hosted player API.
swaggerDoc.paths["/tournament"].post.parameters[0].schema.default.players = [
  { name: "Goodguess over HTTP", aiType: "httpproxy", strategyUri: `http://localhost:${playerApiPort}/api/strategies/0` },
  { name: "No pricness strat", aiType: "noprincess" },
  { name: "Random", aiType: "random" }
];

swaggerTools.initializeMiddleware(swaggerDoc, middleware => {
  app.use(middleware.swaggerMetadata());
  app.use(middleware.swaggerValidator());
  app.use(middleware.swaggerRouter(routerOptions));
  app.use(function (err, req, res, next) {
    res.json({ message: err.message, stack: err.stack });
  });
  app.use(middleware.swaggerUi({ swaggerUi: "/" }));
  app.listen(port, () => console.log(`Game runner API listening on port ${port}`));
});