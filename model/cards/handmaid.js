class Handmaid {
  constructor() {
    this.value = 4;
    this.name = "Handmaid";
  }    

  play(player) {
    player.protected = true;
  }
}

module.exports = Handmaid;