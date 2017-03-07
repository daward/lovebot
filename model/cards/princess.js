class Princess {
  constructor() {    
    this.value = 8;
    this.name = "Princess";
  }

  play(player) {
    player.kill();
  }
}

module.exports = Princess;