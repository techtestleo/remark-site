class Capture {
  gameStateRef = null;
  constructor(gameStateRef) {
    this.gameStateRef = gameStateRef;
    this.bindEvents();
  }
  bindEvents() {
    this.bindKeyDown();
    this.bindKeyUp();
  }
  bindKeyUp() {
    document.addEventListener('keyup', (ev) => {
      this.onKeyUp(ev);
    });
  }
  bindKeyDown() {
    document.addEventListener('keydown', (ev) => {
      this.onKeydown(ev);
    });
  }
  /**
   * @param {KeyboardEvent} e 
   */
  onKeyUp(e) {
    this.gameStateRef.keyUp(e);
  }
  /**
   * @param {KeyboardEvent} e
   */
  onKeydown(e) {
    this.gameStateRef.keyDown(e);
  }
}