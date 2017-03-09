let lovebotPlayer = require('lovebotplayer');

// This is just for the player API that his hosted in this app
// for testing.
module.exports = (player, opponents) => {
  return lovebotPlayer.random(player, opponents);
};