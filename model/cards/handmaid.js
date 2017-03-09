class Handmaid {
  constructor() {
    this.value = 4;
    this.name = "handmaid";
  }    

  play(player) {
    player.protected = true;
  }

  info() {
    return {
      name: this.name,
      value: this.value
    };
  }
}

module.exports = Handmaid;