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

