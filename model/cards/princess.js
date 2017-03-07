class Princess {
  constructor() {    
    this.value = 8;
    this.name = "princess";
  }

  play(player) {
    player.kill();
  }
}

module.exports = Princess;