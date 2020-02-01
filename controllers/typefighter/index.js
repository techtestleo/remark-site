/*
----------------- Type fighter mini game -----------------

keyboard capture class

state class



*/


class MemoryState {
  upEvent = null;
  downEvent = null;
  view = {
    // Array of words (words = array of letters)
    currentLine: createLine(3, 3),
    // Focus is the index of our next letter target
    currentFocus: 0,
  }
  keyState = {
    shift: false,
    control: false,
    alt: false,
    eventTime: 0
  }
  constructor() {
    this.downEvent = null;
    this.upEvent = null;
  }
  keyDown(ev) {
    this.determineHit(ev);
  }
  keyUp(ev) {
    this.endPressUpdate(ev);
  }
  determineHit(ev) {

  }
  endPressUpdate(ev) {

  }
  /**
   * 
   * @param {KeyboardEvent} ev 
   */
  manageState(ev) {
    return new Promise((resolve, reject) => {
      this.keyState.shift = ev.shiftKey;
      this.keyState.control = ev.ctrlKey;
      this.keyState.alt = ev.altKey;
      this.keyState.eventTime = ev.timeStamp
    })
  }
}

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
      this.onKeyUp(ev)
    });
  }
  bindKeyDown() {
    document.addEventListener('keydown', (ev) => {
      this.onKeydown(ev)
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
class View {
  gameStateRef = null;
  constructor(gameStateRef) {
    this.gameStateRef = gameStateRef;
    this.setup();
  }
  setup() {
    const gameContainer = document.createElement('div');
    document.body.appendChild(gameContainer);
    gameContainer.id = 'container';
    // add initial words to view
    this.gameStateRef.view.currentLine.forEach((word) => {
      const wordDiv = document.createElement('div');
      document.getElementById('container').appendChild(wordDiv);
      wordDiv.innerHTML = word.join('');
    })
  }
}

class Game {
  capture = null;
  memory = null;
  view = null;
  constructor() {
    // Create the global game state
    this.memory = new MemoryState();
    // Bind the capture methods, with ref. to global state
    this.capture = new Capture(this.memory);
    // Create the game view, and bind to global state
    this.view = new View(this.memory);
    // logger
  }
}

const main = new Game();