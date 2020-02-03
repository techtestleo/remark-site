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
  update(ev) {
    if (ev.type === 'keyup') {
      this.updateNotifications();
    }
  }

  updateNotifications() {
    const shown = document.getElementsByClassName('complete-ref-show');
    if (shown.length > 0) {
      for (var i = 0; i < shown.length; i++) {
        shown[i].className = 'complete-ref';
      }
    }
  }

  setup() {

    const masterContainer = document.createElement('div');
    document.body.insertBefore(masterContainer, document.getElementsByClassName('footnotes')[0]);
    masterContainer.id = 'master-container';

    const gameContainer = document.createElement('div');
    document.getElementById(masterContainer.id).appendChild(gameContainer);
    gameContainer.id = 'container';
    gameContainer.className = 'upgrade-container';
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
    statsContainer.className = 'upgrade-container';
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
    purchaseBot.innerHTML = 'purchase bot: ';

    const purchaseBotButton = document.createElement('button');
    purchaseBotButton.innerHTML = `$${this.gameStateRef.robotOptions.cost}`;
    document.getElementById('upgrade-bot-wrap').appendChild(purchaseBotButton);
    purchaseBotButton.onclick = (ev) => {
      this.gameStateRef.purchaseBot(ev);
    }

    //
    const innerPointsContainer = document.createElement('div');
    document.getElementById('outer-container').appendChild(innerPointsContainer);
    innerPointsContainer.id = 'points-container';
    innerPointsContainer.className = 'upgrade-container'
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
    notifications.className = 'upgrade-container';

    const wordsComplete = document.createElement('div');
    document.getElementById(notifications.id).appendChild(wordsComplete);
    wordsComplete.innerHTML = `+ $${this.gameStateRef.rates.words} word complete!`;
    wordsComplete.id = 'wordsComplete-ref';
    wordsComplete.className = 'complete-ref';

    const linesComplete = document.createElement('div');
    document.getElementById(notifications.id).appendChild(linesComplete);
    linesComplete.innerHTML = `+ $${this.gameStateRef.rates.lines} line complete!`;
    linesComplete.id = 'linesComplete-ref';
    linesComplete.className = 'complete-ref';

    const sectionsComplete = document.createElement('div');
    document.getElementById(notifications.id).appendChild(sectionsComplete);
    sectionsComplete.innerHTML = `+ $${this.gameStateRef.rates.sections} section complete!`;
    sectionsComplete.id = 'sectionsComplete-ref';
    sectionsComplete.className = 'complete-ref';

    const pagesComplete = document.createElement('div');
    document.getElementById(notifications.id).appendChild(pagesComplete);
    pagesComplete.innerHTML = `+ $${this.gameStateRef.rates.pages} page complete!`;
    pagesComplete.id = 'pagesComplete-ref';
    pagesComplete.className = 'complete-ref';

    const upgradeComplete = document.createElement('div');
    document.getElementById(notifications.id).appendChild(upgradeComplete);
    upgradeComplete.innerHTML = `upgrade complete!`;
    upgradeComplete.id = 'upgradeComplete-ref';
    upgradeComplete.className = 'complete-ref';

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