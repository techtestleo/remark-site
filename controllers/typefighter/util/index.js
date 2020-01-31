
// const letters = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'];
const allKeys = 'qwertyuiopasdfghjklzxcvbnm'
const letters = allKeys.split('');

/**
 * Random number between two numbers.
 * @param min 
 * @param max 
 */
function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Generate a word of a specific length.
 * @param wordLength number
 */
const createWord = (wordLength) => {
  let output = [];
  for (wordLength; wordLength > 0; wordLength--) {
    output.push(
      letters[randomIntFromInterval(0, letters.length - 1)]
    );
  }
  return output;
}


/**
 * Returns an array of random words.
 * @param lineLength 
 * @param wordLength
 */
const createLine = (lineLength, wordLength) => {
  let output = [];
  for (lineLength; lineLength > 0; lineLength--) {
    output.push(
      createWord(wordLength)
    );
  }
  return output;
};

const createContainers = () => {
  let container = document.createElement('div');
  document.body.appendChild(container);
  container.id = 'container'

  let currentWord = document.createElement('span');
  document.getElementById('container').appendChild(currentWord);
  currentWord.id = 'current-word';

  let nextWord = document.createElement('span');
  document.getElementById('container').appendChild(nextWord);
  nextWord.id = 'next-word';

  let thirdWord = document.createElement('span');
  document.getElementById('container').appendChild(thirdWord);
  thirdWord.id = 'third-word';

  let fourthWord = document.createElement('span');
  document.getElementById('container').appendChild(fourthWord);
  fourthWord.id = 'fourth-word';

  let fifthWord = document.createElement('span');
  document.getElementById('container').appendChild(fifthWord);
  fifthWord.id = 'fifth-word';

  let sixthWord = document.createElement('span');
  document.getElementById('container').appendChild(sixthWord);
  sixthWord.id = 'sixth-word';

  let seventhWord = document.createElement('span');
  document.getElementById('container').appendChild(seventhWord);
  seventhWord.id = 'seventh-word';

}

function updateDisplay() {
  document.getElementById('current-word').innerHTML = replacer(state.currentLine[0].join(' '));
  document.getElementById('next-word').innerHTML = state.currentLine[1] ? replacer(state.currentLine[1].join(' ')) : "???";
  document.getElementById('third-word').innerHTML = state.currentLine[2] ? replacer(state.currentLine[2].join(' ')) : "???";
  document.getElementById('fourth-word').innerHTML = state.currentLine[3] ? replacer(state.currentLine[3].join(' ')) : "???";
  document.getElementById('fifth-word').innerHTML = state.currentLine[4] ? replacer(state.currentLine[4].join(' ')) : "???";
  document.getElementById('sixth-word').innerHTML = state.currentLine[5] ? replacer(state.currentLine[5].join(' ')) : "???";
  document.getElementById('seventh-word').innerHTML = state.currentLine[6] ? replacer(state.currentLine[6].join(' ')) : "???";
}

function replacer(str) {
  str = str.split('ArrowRight').join(arrowMapping.ArrowRight);
  str = str.split('ArrowUp').join(arrowMapping.ArrowUp);
  str = str.split('ArrowDown').join(arrowMapping.ArrowDown);
  str = str.split('ArrowLeft').join(arrowMapping.ArrowLeft);
  return str;
}