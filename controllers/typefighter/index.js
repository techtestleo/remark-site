/*
----------------- Type fighter mini game -----------------

keyboard capture class

state class



*/
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

class MemoryState {
  upEvent = null;
  downEvent = null;
  lastPressWasHit = false;
  wordRefs = [];
  baseWordLength = 3;
  baseLineLength = 3;
  pointRef = {}
  robot = null;
  robotOptions = {
    rate: 500,
    cost: 500
  }
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
  }
  inputUpgradeCosts = {
    baseWordLength: 5,
    baseLineLength: 10,
  }
  costs = {
    letters: 1,
    words: 15,
    lines: 30,
    sections: 75,
    pages: 250,
  }
  upgradeRate = {
    letters: 0.5,
    words: 0.75,
    lines: 1.1,
    sections: 1.75,
    pages: 2.23,
  }
  sectionRate = 2;
  pageRate = 2;
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
  increaseRate() {
    this.robotOptions.rate = Number(this.robotOptions.rate - 25);
  }
  handleUpgrade(upgradeCategory) {
    this.rates[upgradeCategory] = Number((this.rates[upgradeCategory] * (1 + this.upgradeRate[upgradeCategory])).toFixed(2));
    if (document.getElementById(`${upgradeCategory}Complete-ref`)) {
      document.getElementById(`${upgradeCategory}Complete-ref`).innerHTML = `+$${this.rates[upgradeCategory]} ${upgradeCategory} complete!`;
    } else if (document.getElementById(`${upgradeCategory}Complete-ref-show`)) {
      document.getElementById(`${upgradeCategory}Complete-ref-show`).innerHTML = `+$${this.rates[upgradeCategory]} ${upgradeCategory} complete!`;
    }

  }
  // inputUpgradeCosts
  handleInputUpgrade(inputUpgradeCategory) {
    if (this.playerStats.earnings > this.inputUpgradeCosts[inputUpgradeCategory]) {
      this[inputUpgradeCategory] += 1;
      this.inputUpgradeCosts[inputUpgradeCategory] = Number((this.inputUpgradeCosts[inputUpgradeCategory] * 1.5).toFixed(2))
      document.getElementById(inputUpgradeCategory).innerHTML = `$${this.inputUpgradeCosts[inputUpgradeCategory]}`;
      document.getElementById(`upgrade-${inputUpgradeCategory}`).innerHTML = `${inputUpgradeCategory.split('Length')[0].split('base')[1]} length: ${this[inputUpgradeCategory]}`.toLowerCase();
    }
  }
  purchaseBot(ev) {
    if (this.playerStats.earnings > this.robotOptions.cost) {

      document.getElementById('stats-container').removeChild(
        document.getElementById('upgrade-bot-wrap')
      );
      this.robot = new Robot(this);


      let btnWrap = document.createElement('div');
      btnWrap.id = 'robot-button-wrap';
      document.getElementById('stats-container').appendChild(
        btnWrap
      );
      const rateText = document.createElement('div');
      rateText.innerHTML = `Rate: ${this.robotOptions.rate}ms`;
      rateText.className = 'payment'
      btnWrap.appendChild(rateText);


      let startStopWrap = document.createElement('div');
      startStopWrap.id = 'start-stop';
      btnWrap.appendChild(startStopWrap);

      let startBtn = document.createElement('button');
      startBtn.onclick = (ev) => { this.robot.start() };
      startBtn.id = 'robot-start';
      document.getElementById('start-stop').appendChild(
        startBtn
      )
      startBtn.innerHTML = 'start';

      let stopBtn = document.createElement('button');
      stopBtn.onclick = (ev) => {
        this.robot.reset()
      };
      stopBtn.id = 'robot-stop';
      document.getElementById('start-stop').appendChild(
        stopBtn
      )
      stopBtn.innerHTML = 'stop';

      let incBtn = document.createElement('button');
      incBtn.onclick = (ev) => {
        if (this.playerStats.earnings > this.robotOptions.cost) {
          this.playerStats.earnings = Number(this.playerStats.earnings - this.robotOptions.cost);
          this.robot.increaseRate();
          this.robotOptions.cost = Number((this.robotOptions.cost * 2).toFixed(2));
          rateText.innerHTML = `Rate: ${this.robotOptions.rate}ms`;
          incBtn.innerHTML = `reduce by 25ms - cost: $${this.robotOptions.cost}`;
        }
      };
      incBtn.innerHTML = `reduce by 25ms - cost: $${this.robotOptions.cost}`;
      incBtn.id = 'robot-inc';
      btnWrap.appendChild(incBtn);


    }
  }
  purchaseUpgrade(ev) {
    if (this.playerStats.earnings > this.costs[ev.target.id]) {
      // increase costs
      this.costs[ev.target.id] = Number((this.costs[ev.target.id] * 1.1).toFixed(2));
      // increse upgrade rate
      this.upgradeRate[ev.target.id] = Number((this.upgradeRate[ev.target.id] + 0.01).toFixed(2));
      // update cost button
      document.getElementById(ev.target.id).innerHTML = `$${this.costs[ev.target.id]} +$${this.upgradeRate[ev.target.id]}%`;
      // decrement earnings
      this.playerStats.earnings = Number((this.playerStats.earnings - this.costs[ev.target.id]).toFixed(2));
      // update upgrade notification
      this.handleUpgrade(ev.target.id);

      if (document.getElementById('upgradeComplete-ref')) {
        document.getElementById('upgradeComplete-ref').id = 'upgradeComplete-ref-show';
      }
      document.getElementById('earnings-ref').innerHTML = `earnings: ${this.playerStats.earnings}`;
      document.getElementById(`upgrade-${ev.target.id}`).innerHTML = `${ev.target.id}: $${this.rates[ev.target.id]}`;
    }

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
      if (document.getElementById('wordsComplete-ref')) {
        document.getElementById('wordsComplete-ref').id = 'wordsComplete-ref-show'
      }
    }
    // go to the next line if the current line is done
    if (this.view.currentLine.length === 0) {
      // this.baseWordLength++;
      // this.baseLineLength++;
      this.view.currentLine = createLine(this.baseWordLength, this.baseWordLength);
      this.playerStats.lines++;
      this.playerStats.earnings = Number(this.playerStats.earnings + this.rates.lines)
      if (document.getElementById('linesComplete-ref')) {

        document.getElementById('linesComplete-ref').id = 'linesComplete-ref-show';
      }
      // increment sections
      if (this.playerStats.lines % this.sectionRate === 0) {
        this.playerStats.earnings = Number(this.playerStats.earnings + this.rates.sections)
        this.playerStats.sections++

        if (document.getElementById('sectionsComplete-ref')) {
          document.getElementById('sectionsComplete-ref').id = 'sectionsComplete-ref-show'
        }
        // increment page
        if (this.playerStats.sections % this.pageRate === 0) {
          this.playerStats.earnings = Number(this.playerStats.earnings + this.rates.pages)
          this.playerStats.pages++
          this.baseWordLength++;
          document.getElementById(`upgrade-baseWordLength`).innerHTML = `word length: ${this.baseWordLength}`;
          if (document.getElementById('pagesComplete-ref')) {
            document.getElementById('pagesComplete-ref').id = 'pagesComplete-ref-show'
          }
        }
        if (this.pageRate % 2 === 0) {
          this.baseLineLength++;
          document.getElementById(`upgrade-baseLineLength`).innerHTML = `line length: ${this.baseLineLength}`;
        }
      }
    }

    // set the next target
    this.view.currentTarget = this.view.currentLine[0][0];
    this.playerStats.earnings = Number(this.playerStats.earnings.toFixed(2));
  }
  updateNotifications() {
    if (document.getElementById('linesComplete-ref-show')) {
      document.getElementById('linesComplete-ref-show').id = 'linesComplete-ref'
    }
    if (document.getElementById('wordsComplete-ref-show')) {
      document.getElementById('wordsComplete-ref-show').id = 'wordsComplete-ref'
    }
    if (document.getElementById('sectionsComplete-ref-show')) {
      document.getElementById('sectionsComplete-ref-show').id = 'sectionsComplete-ref'
    }
    if (document.getElementById('pagesComplete-ref-show')) {
      document.getElementById('pagesComplete-ref-show').id = 'pagesComplete-ref'
    }
    if (document.getElementById('upgradeComplete-ref-show')) {
      console.log('hide upgrade');
      document.getElementById('upgradeComplete-ref-show').id = 'upgradeComplete-ref'
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
  upgradeContainer = null;
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
    document.body.insertBefore(masterContainer, document.getElementsByClassName('footnotes')[0]);
    masterContainer.id = 'master-container';

    const gameContainer = document.createElement('div');
    document.getElementById(masterContainer.id).appendChild(gameContainer);
    gameContainer.id = 'container';
    this.gameContainer = gameContainer;

    const pointsContainer = document.createElement('div');
    document.getElementById(masterContainer.id).appendChild(pointsContainer);
    pointsContainer.id = 'outer-container';
    this.pointsContainer = pointsContainer;

    const upgradeWrapper = document.createElement('div');
    document.getElementById(masterContainer.id).appendChild(upgradeWrapper);
    upgradeWrapper.id = 'upgradeWrapper-container';
    this.upgradeWrapper = upgradeWrapper;

    const upgradeContainer = document.createElement('div');
    document.getElementById('upgradeWrapper-container').appendChild(upgradeContainer);
    upgradeContainer.id = 'upgrade-container';
    upgradeContainer.className = 'upgrade-container';
    this.upgradeContainer = upgradeContainer;
    // starting rates
    const payment = document.createElement('div');
    payment.className = 'payment';
    payment.innerHTML = 'Upgrade payment rates:'
    upgradeContainer.appendChild(payment);
    const rates = Object.entries(this.gameStateRef.rates);
    const costs = Object.values(this.gameStateRef.costs);
    const upgradeRates = Object.values(this.gameStateRef.upgradeRate);
    rates.forEach((rate, i) => {

      const rateContainer = document.createElement('div');
      rateContainer.id = `rate-${i}`;
      rateContainer.className = `rate`;
      document.getElementById(upgradeContainer.id).appendChild(rateContainer);

      const upgradeCategory = document.createElement('div');
      upgradeCategory.innerHTML = `${rate[0]}: $${rate[1]}`;
      upgradeCategory.id = `upgrade-${rate[0]}`;

      document.getElementById(rateContainer.id).appendChild(upgradeCategory);

      const upgradeButton = document.createElement('button');
      upgradeButton.innerHTML = `$${costs[i]} +${upgradeRates[i]}%`
      upgradeButton.id = `${rate[0]}`
      upgradeButton.onclick = (ev) => { this.gameStateRef.purchaseUpgrade(ev) };

      document.getElementById(rateContainer.id).appendChild(upgradeButton);

    });

    // Stats & word/line upgrades

    const statsContainer = document.createElement('div');
    document.getElementById('upgradeWrapper-container').appendChild(statsContainer);
    statsContainer.id = 'stats-container';
    this.statsContainer = statsContainer;

    const upgradeText = document.createElement('div');
    upgradeText.className = 'payment';
    upgradeText.innerHTML = 'Upgrade inputs:'
    statsContainer.appendChild(upgradeText);

    // upgrade word length
    const upgradeWordWrap = document.createElement('div');
    upgradeWordWrap.id = 'upgrade-word-wrap';
    upgradeWordWrap.className = 'rate';
    document.getElementById('stats-container').appendChild(upgradeWordWrap);

    const upgradeWord = document.createElement('div');
    document.getElementById('upgrade-word-wrap').appendChild(upgradeWord);
    upgradeWord.id = 'upgrade-baseWordLength'
    upgradeWord.innerHTML = `word length: ${this.gameStateRef.baseWordLength}`;

    const upgradeWordButton = document.createElement('button');
    upgradeWordButton.innerHTML = `$${this.gameStateRef.inputUpgradeCosts.baseWordLength}`;
    upgradeWordButton.id = `baseWordLength`;
    upgradeWordButton.onclick = (ev) => { this.gameStateRef.handleInputUpgrade(ev.target.id) }

    document.getElementById('upgrade-word-wrap').appendChild(upgradeWordButton);

    const upgradeLineWrap = document.createElement('div');
    upgradeLineWrap.id = 'upgrade-line-wrap';
    upgradeLineWrap.className = 'rate';
    document.getElementById('stats-container').appendChild(upgradeLineWrap);

    const upgradeLine = document.createElement('div');
    document.getElementById('upgrade-line-wrap').appendChild(upgradeLine);
    upgradeLine.id = 'upgrade-baseLineLength'
    upgradeLine.innerHTML = `line length: ${this.gameStateRef.baseLineLength}`;

    const upgradeLineButton = document.createElement('button');
    upgradeLineButton.innerHTML = `$${this.gameStateRef.inputUpgradeCosts.baseLineLength}`;
    upgradeLineButton.id = `baseLineLength`;
    upgradeLineButton.onclick = (ev) => { this.gameStateRef.handleInputUpgrade(ev.target.id) }
    document.getElementById('upgrade-line-wrap').appendChild(upgradeLineButton);

    document.getElementById('stats-container').appendChild(
      document.createElement('hr')
    )

    const purchaseBotWrap = document.createElement('div');
    purchaseBotWrap.id = 'upgrade-bot-wrap';
    purchaseBotWrap.className = 'rate';
    document.getElementById('stats-container').appendChild(purchaseBotWrap);

    const purchaseBot = document.createElement('div');
    document.getElementById('upgrade-bot-wrap').appendChild(purchaseBot);
    purchaseBot.id = 'upgrade-bot-length'
    purchaseBot.innerHTML = 'puchase bot: ';

    const purchaseBotButton = document.createElement('button');
    purchaseBotButton.innerHTML = `$150`;
    document.getElementById('upgrade-bot-wrap').appendChild(purchaseBotButton);
    purchaseBotButton.onclick = (ev) => {
      this.gameStateRef.purchaseBot(ev);
    }

    //
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

    const wordsComplete = document.createElement('div');
    document.getElementById(notifications.id).appendChild(wordsComplete);
    wordsComplete.innerHTML = `+ $${this.gameStateRef.rates.words} word complete!`;
    wordsComplete.id = 'wordsComplete-ref';

    const linesComplete = document.createElement('div');
    document.getElementById(notifications.id).appendChild(linesComplete);
    linesComplete.innerHTML = `+ $${this.gameStateRef.rates.lines} line complete!`;
    linesComplete.id = 'linesComplete-ref';

    const sectionsComplete = document.createElement('div');
    document.getElementById(notifications.id).appendChild(sectionsComplete);
    sectionsComplete.innerHTML = `+ $${this.gameStateRef.rates.sections} section complete!`;
    sectionsComplete.id = 'sectionsComplete-ref';

    const pagesComplete = document.createElement('div');
    document.getElementById(notifications.id).appendChild(pagesComplete);
    pagesComplete.innerHTML = `+ $${this.gameStateRef.rates.pages} page complete!`;
    pagesComplete.id = 'pagesComplete-ref';

    const upgradeComplete = document.createElement('div');
    document.getElementById(notifications.id).appendChild(upgradeComplete);
    upgradeComplete.innerHTML = `upgrade complete!`;
    upgradeComplete.id = 'upgradeComplete-ref';

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