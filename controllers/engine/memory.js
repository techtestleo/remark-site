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
    cost: 750,
    upgradeRate: 25
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
    letters: 0.05,
    words: 0.10,
    lines: 0.25,
    sections: 0.50,
    pages: 1.5,
  }
  inputUpgradeCosts = {
    baseWordLength: 5,
    baseLineLength: 10,
  }
  costs = {
    letters: 15,
    words: 7.5,
    lines: 5,
    sections: 2.5,
    pages: 1,
  }
  upgradeRate = {
    letters: 1.98,
    words: 1.75,
    lines: 1.51,
    sections: 1.27,
    pages: 1.15,
  }
  sectionRate = 4;
  pageRate = 3;
  playerStats = {
    earnings: 5,
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
  ascend() {
    document.getElementById('stats-container').removeChild(document.getElementById('robot-button-wrap'));
    let ascendButton = document.createElement('button');
    document.getElementById('stats-container').appendChild(ascendButton);
    ascendButton.innerHTML = 'start again';
    ascendButton.onclick = (ev) => {
      this.robot.reset();
      main.reset();
    }
  }
  increaseRate() {
    this.robotOptions.upgradeRate = Number(this.robotOptions.upgradeRate - 1);
    if (this.robotOptions.upgradeRate === 0) {
      this.robotOptions.upgradeRate = 1;
    }
    this.robotOptions.rate = Number(this.robotOptions.rate - this.robotOptions.upgradeRate);
    if (this.robotOptions.rate < 0) {
      this.ascend();
    }
    this.robotOptions.cost = Number(this.robotOptions.cost * 1.1);
  }
  handleUpgrade(upgradeCategory) {
    this.rates[upgradeCategory] = Number((this.rates[upgradeCategory] * (this.upgradeRate[upgradeCategory])).toFixed(2));
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
      this.playerStats.earnings -= this.robotOptions.cost;
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
          incBtn.innerHTML = `reduce by ${this.robotOptions.upgradeRate}ms - cost: $${this.robotOptions.cost}`;
          document.getElementById('earnings-ref').innerHTML = `earnings: $${this.playerStats.earnings}`;
        }
      };
      incBtn.innerHTML = `reduce by ${this.robotOptions.upgradeRate}ms - cost: $${this.robotOptions.cost}`;
      incBtn.id = 'robot-inc';
      btnWrap.appendChild(incBtn);

      document.getElementById('earnings-ref').innerHTML = `earnings: $${this.playerStats.earnings}`;
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
      document.getElementById('earnings-ref').innerHTML = `earnings: $${this.playerStats.earnings}`;
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
        if (this.pageRate % 5 === 0) {
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
