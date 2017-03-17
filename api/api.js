let path = require('path');
let fs = require('fs');
let _ = require('lodash');
let YAML = require('yamljs');
let express = require('express');
let swaggerTools = require('swagger-tools');
let lovebotPlayer = require('lovebotplayer');

let port = process.env.PORT || 3333;
let playerApiPort = port - 1;

let app = express();

let swaggerPath = path.join(__dirname, 'swagger.yaml');
let swaggerContent = fs.readFileSync(swaggerPath);
swaggerContent = _.replace(swaggerContent, "%PLAYERAPIPORT%", playerApiPort);
let swaggerDoc = YAML.parse(swaggerContent);

swaggerTools.initializeMiddleware(swaggerDoc, middleware => {
  app.use(middleware.swaggerMetadata());
  app.use(middleware.swaggerValidator());

  // this seems like the right way to do this, even though i only have one route...
  app.use(middleware.swaggerRouter({ controllers: path.join(__dirname, 'controllers') }));

  // jsonify failures in the api.
  app.use(function (err, req, res, next) {
    res.json({ message: err.message, stack: err.stack });
  });

  app.use(middleware.swaggerUi({ swaggerUi: "/" }));
  app.listen(port, () => console.log(`Game runner API listening on port ${port}`));
});