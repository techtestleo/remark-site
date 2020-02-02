class Robot {
  gameStateRef = null;
  ticker = null;
  constructor(options) {
    this.gameStateRef = options;
  }
  typeLetter() {
    this.gameStateRef.lastPressWasHit = true;
    this.gameStateRef.updateMemory();
    this.gameStateRef.endPressUpdate();
  }
  start() {
    this.ticker = setInterval(() => {
      this.typeLetter();
    }, this.gameStateRef.robotOptions.rate);
  }
  reset() {
    clearInterval(this.ticker);
  }
  increaseRate() {
    this.gameStateRef.increaseRate();
  }
}
