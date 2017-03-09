class Princess {
  constructor() {
    this.value = 8;
    this.name = "princess";
  }

  play(player) {
    player.kill();
  }

  info() {
    return {
      name: this.name,
      value: this.value
    };
  }
}

module.exports = Princess;