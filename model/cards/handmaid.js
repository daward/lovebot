class Handmaid {
  constructor() {
    this.value = 4;
    this.name = "handmaid";
  }    

  play(player) {
    player.protected = true;
  }
}

module.exports = Handmaid;