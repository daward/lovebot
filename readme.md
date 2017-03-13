# Lovebot
https://lovebot-runner.herokuapp.com/

## usage
### run once
* edit game parameters in index.js
* `$ node index.js `

### runner API
* `$ npm start`
* Access swagger UI at http://localhost:3333/

## deployment
The app is currently deployed on heroku. In order to deploy, you must be added as a contributor on the heroku app by Paul.
Once you're added, prepare for deployment with:
```shell
$ heroku login
$ git remote add heroku https://git.heroku.com/lovebot-runner.git
```
And the trigger a deployment with:
```shell
$ git push heroku master
```