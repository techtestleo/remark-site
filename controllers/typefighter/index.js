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
  baseWordLength = 3;
  baseLineLength = 3;
  pointRef = {}
  view = {
    // Array of words (words = array of letters)
    currentLine: createLine(this.baseLineLength, this.baseWordLength),
    currentTarget: ''
  }
  keyState = {
    shift: false,
    control: false,
    alt: false,
    eventTime: 0
  }
  rates = {
    letters: 0.02,
    words: 0.05,
    lines: 0.25,
    sections: 0.75,
    pages: 2.5,
    sectionRate: 2,
    pageRate: 2
  }
  playerStats = {
    earnings: 0,
    letters: 0,
    words: 0,
    lines: 0,
    sections: 0,
    pages: 0,
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
  updatePointDisplay() {
    const pointRefs = Object.values(this.pointRef);
    pointRefs.forEach((reference) => {
      if (reference === 'earnings-ref') {
        console.log(this.playerStats);
        document.getElementById(reference).innerHTML = `${reference.replace('-ref', '')}: $${this.playerStats[reference.replace('-ref', '')]}`;
      } else {
        document.getElementById(reference).innerHTML = `${reference.replace('-ref', '')}: ${this.playerStats[reference.replace('-ref', '')]}`;
      }
    })
  }
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

          document.getElementById(reference).innerHTML = this.view.currentLine[i].join('');
        } else {
          document.getElementById(reference).innerHTML = '???';
        }
      });
      // Add new containers if line array is longer than captured references.
      if (this.wordRefs.length < this.view.currentLine.length) {
        let diff = this.view.currentLine.length - this.wordRefs.length;
        for (diff; diff > 0; diff--) {
          const wordDiv = document.createElement('div');
          document.getElementById('container').appendChild(wordDiv);
          wordDiv.innerHTML = this.view.currentLine[this.view.currentLine.length - 1].join('');
          wordDiv.id = `word-${this.wordRefs.length}`;
          this.wordRefs.push(wordDiv.id);
        }
      }
      // Updates the point display
      this.updatePointDisplay();
    });
  }
  updateMemory() {
    if (this.lastPressWasHit) {
      // remove letter from currentLine
      this.view.currentLine[0].shift();
      this.playerStats.letters++;
      this.playerStats.earnings = Number(this.playerStats.earnings + this.rates.letters)
    }
    // go to the next word if the current word is done
    if (this.view.currentLine[0].length === 0) {
      this.view.currentLine.shift();
      this.playerStats.words++;
      this.playerStats.earnings = Number(this.playerStats.earnings + this.rates.words)
      document.getElementById('wordComplete-ref').id = 'wordComplete-ref-show'
    }
    // go to the next line if the current line is done
    if (this.view.currentLine.length === 0) {
      // this.baseWordLength++;
      // this.baseLineLength++;
      this.view.currentLine = createLine(this.baseWordLength, this.baseWordLength);
      this.playerStats.lines++;
      this.playerStats.earnings = Number(this.playerStats.earnings + this.rates.lines)
      document.getElementById('lineComplete-ref').id = 'lineComplete-ref-show';
      // increment sections
      if (this.playerStats.lines % this.rates.sectionRate === 0) {
        this.playerStats.earnings = Number(this.playerStats.earnings + this.rates.sections)
        this.playerStats.sections++
        this.baseWordLength++;
        document.getElementById('sectionComplete-ref').id = 'sectionComplete-ref-show'
        // increment page
        if (this.playerStats.sections % this.rates.pageRate === 0) {
          this.playerStats.earnings = Number(this.playerStats.earnings + this.rates.pages)
          this.playerStats.pages++
          this.baseLineLength++;
          document.getElementById('pageComplete-ref').id = 'pageComplete-ref-show'
        }
      }
    }

    // set the next target
    this.view.currentTarget = this.view.currentLine[0][0];
    this.playerStats.earnings = Number(this.playerStats.earnings.toFixed(2));
  }
  updateNotifications() {
    if (document.getElementById('lineComplete-ref-show')) {
      document.getElementById('lineComplete-ref-show').id = 'lineComplete-ref'
    }
    if (document.getElementById('wordComplete-ref-show')) {
      document.getElementById('wordComplete-ref-show').id = 'wordComplete-ref'
    }
    if (document.getElementById('sectionComplete-ref-show')) {
      document.getElementById('sectionComplete-ref-show').id = 'sectionComplete-ref'
    }
    if (document.getElementById('pageComplete-ref-show')) {
      document.getElementById('pageComplete-ref-show').id = 'pageComplete-ref'
    }
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
      this.gameStateRef.updateNotifications();
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
  gameContainer = null;
  pointsContainer = null;
  pointRef = {
    earnings: 0,
    letters: 0,
    words: 0,
    lines: 0,
  }
  constructor(gameStateRef) {
    this.gameStateRef = gameStateRef;
    this.setup();

  }
  setup() {

    const masterContainer = document.createElement('div');
    document.body.appendChild(masterContainer);
    masterContainer.id = 'master-container';

    const gameContainer = document.createElement('div');
    document.getElementById('master-container').appendChild(gameContainer);
    gameContainer.id = 'container';
    this.gameContainer = gameContainer;

    const pointsContainer = document.createElement('div');
    document.getElementById('master-container').appendChild(pointsContainer);
    pointsContainer.id = 'outer-container';
    this.pointsContainer = pointsContainer;

    const innerPointsContainer = document.createElement('div');
    document.getElementById('outer-container').appendChild(innerPointsContainer);
    innerPointsContainer.id = 'points-container';
    this.innerPointsContainer = innerPointsContainer;

    const earnings = document.createElement('div');
    document.getElementById('points-container').appendChild(earnings);
    earnings.innerHTML = `earnings: $${this.gameStateRef.playerStats.earnings}`;
    earnings.id = 'earnings-ref';
    this.pointRef.earnings = earnings.id;

    const letters = document.createElement('div');
    document.getElementById('points-container').appendChild(letters);
    letters.innerHTML = `letters: ${this.gameStateRef.playerStats.letters}`;
    letters.id = 'letters-ref';
    this.pointRef.letters = letters.id;

    const words = document.createElement('div');
    document.getElementById('points-container').appendChild(words);
    words.innerHTML = `words: ${this.gameStateRef.playerStats.words}`;
    words.id = 'words-ref';
    this.pointRef.words = words.id;

    const lines = document.createElement('div');
    document.getElementById('points-container').appendChild(lines);
    lines.innerHTML = `lines: ${this.gameStateRef.playerStats.lines}`;
    lines.id = 'lines-ref';
    this.pointRef.lines = lines.id;

    const sections = document.createElement('div');
    document.getElementById('points-container').appendChild(sections);
    sections.innerHTML = `sections: ${this.gameStateRef.playerStats.sections}`;
    sections.id = 'sections-ref';
    this.pointRef.sections = sections.id;

    const pages = document.createElement('div');
    document.getElementById('points-container').appendChild(pages);
    pages.innerHTML = `pages: ${this.gameStateRef.playerStats.pages}`;
    pages.id = 'pages-ref';
    this.pointRef.pages = pages.id;

    const notifications = document.createElement('div');
    document.getElementById('outer-container').appendChild(notifications);
    notifications.id = 'notifications-container';

    const wordComplete = document.createElement('div');
    document.getElementById(notifications.id).appendChild(wordComplete);
    wordComplete.innerHTML = `+$${this.gameStateRef.rates.words} word complete!`;
    wordComplete.id = 'wordComplete-ref';

    const lineComplete = document.createElement('div');
    document.getElementById(notifications.id).appendChild(lineComplete);
    lineComplete.innerHTML = `+$${this.gameStateRef.rates.lines} line complete!`;
    lineComplete.id = 'lineComplete-ref';

    const sectionComplete = document.createElement('div');
    document.getElementById(notifications.id).appendChild(sectionComplete);
    sectionComplete.innerHTML = `+$${this.gameStateRef.rates.sections} section complete!`;
    sectionComplete.id = 'sectionComplete-ref';

    const pageComplete = document.createElement('div');
    document.getElementById(notifications.id).appendChild(pageComplete);
    pageComplete.innerHTML = `+$${this.gameStateRef.rates.pages} page complete!`;
    pageComplete.id = 'pageComplete-ref';

    // add initial words to view
    this.gameStateRef.view.currentLine.forEach((word, i) => {
      const wordDiv = document.createElement('div');
      document.getElementById('container').appendChild(wordDiv);
      wordDiv.innerHTML = word.join('');
      wordDiv.id = `word-${i}`
      this.wordRefs.push(wordDiv.id);
    })
    this.gameStateRef.wordRefs = this.wordRefs;
    this.gameStateRef.pointRef = this.pointRef;
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