class Countess {
  constructor() {
    this.value = 7;
    this.name = "countess";
  }

  info() {
    return {
      name: this.name,
      value: this.value
    };
  }

  play() {
  }
}

module.exports = Countess;