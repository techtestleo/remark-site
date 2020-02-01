/*
----------------- Type fighter mini game -----------------

keyboard capture class

state class



*/

class MemoryState {
  upEvent = null;
  downEvent = null;
  lastPressWasHit = false;
  wordRefs = [];
  nextWordRefs = [];
  baseWordLength = 3;
  baseLineLength = 3;
  view = {
    // Array of words (words = array of letters)
    currentLine: createLine(this.baseLineLength, this.baseWordLength),
    nextLine: createLine(this.baseLineLength, this.baseWordLength),
    currentTarget: ''
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
    this.view.currentTarget = this.view.currentLine[0][0];
  }
  keyDown(ev) {
    this.manageState(ev).then(() => {
      this.determineHit(ev);
      this.updateMemory();
    });
  }
  keyUp(ev) {
    this.manageState(ev).then(() => {
      this.endPressUpdate(ev);
    });
  }
  /**
  *
  * @param {KeyboardEvent} ev
  */
  determineHit(ev) {
    if (ev.key === this.view.currentTarget) {
      this.lastPressWasHit = true;
    } else {
      this.lastPressWasHit = false;
    }
  }
  endPressUpdate(ev) {
    this.manageState(ev).then(() => {
      // update current line
      this.wordRefs.forEach((reference, i) => {
        if (this.view.currentLine[i]) {
          console.log(`updating word divs: ${i}`, this.view.currentLine[i].join(''))
          document.getElementById(reference).innerHTML = this.view.currentLine[i].join('');
        } else {
          if (this.view.nextLine.length === 0) {
            this.view.nextLine = createLine(this.baseWordLength, this.baseWordLength);
          }
          document.getElementById(reference).innerHTML = this.view.nextLine[0].join('');
          console.log('nextline', this.view.nextLine);
        }
      });
      // update the next line
      this.nextWordRefs.forEach((reference, i) => {
        if (this.view.nextLine[i]) {

          document.getElementById(reference).innerHTML = this.view.nextLine[i].join('');
        } else {
          document.getElementById(reference).innerHTML = '???'
          console.log('nextline', this.view.nextLine);
        }
      })
    });
  }
  updateMemory() {
    if (this.lastPressWasHit) {
      // remove letter from currentLine
      this.view.currentLine[0].shift();
    }
    // go to the next word if the current word is done
    if (this.view.currentLine[0].length === 0) {
      this.view.currentLine.shift();
    }
    // go to the next line if the current line is done
    if (this.view.currentLine.length === 0) {
      this.view.currentLine = this.view.nextLine;
      this.baseWordLength++;
      this.baseLineLength++;
      this.view.nextLine = createLine(this.baseWordLength, this.baseWordLength)
    }
    // set the next target
    this.view.currentTarget = this.view.currentLine[0][0];
    console.log(this.view.currentTarget);
  }
  manageState(ev) {
    return new Promise((resolve, reject) => {
      this.keyState.shift = ev.shiftKey;
      this.keyState.control = ev.ctrlKey;
      this.keyState.alt = ev.altKey;
      this.keyState.eventTime = ev.timeStamp
      resolve();
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
  wordRefs = [];
  nextWordRefs = [];
  constructor(gameStateRef) {
    this.gameStateRef = gameStateRef;
    this.setup();
  }
  setup() {
    const gameContainer = document.createElement('div');
    document.body.appendChild(gameContainer);
    gameContainer.id = 'container';
    // add initial words to view
    this.gameStateRef.view.currentLine.forEach((word, i) => {
      const wordDiv = document.createElement('div');
      document.getElementById('container').appendChild(wordDiv);
      wordDiv.innerHTML = word.join('');
      wordDiv.id = `word-${i}`
      this.wordRefs.push(wordDiv.id);
    })
    this.gameStateRef.wordRefs = this.wordRefs;
    // create the next line
    this.gameStateRef.view.nextLine.forEach((word, i) => {
      const wordDiv = document.createElement('div');
      document.getElementById('container').appendChild(wordDiv);
      wordDiv.innerHTML = word.join('');
      wordDiv.id = `next-word-${i}`;
      this.nextWordRefs.push(wordDiv.id);
    });
    this.gameStateRef.nextWordRefs = this.nextWordRefs;
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