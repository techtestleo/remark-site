/**
 * Type fighter mini game
 */

const arrowMapping = {
  ArrowRight: "👉",
  ArrowLeft: "👈",
  ArrowUp: "👆",
  ArrowDown: "👇",
}

let state = {
  wordLength: 3,
  lineLength: 3,
  shift: false,
  control: false,
  alt: false,
  lastKeyDown: "",
  currentLine: createLine(3, 3),
  keyTarget: ""
}
state.keyTarget = state.currentLine[0][0];
/**
 * Map KeyboardEvent values to state.
 * @param {KeyboardEvent} ev 
 */
function manageState(ev, setLastDown) {
  return new Promise((resolve, reject) => {
    state.shift = ev.shiftKey;
    state.control = ev.ctrlKey;
    state.alt = ev.altKey
    state.lastKeyDown = ev.key
    resolve(ev);
  })
}

createContainers();

document.addEventListener('keydown', (ev) => {
  manageState(ev).then((event) => {

    if (state.lastKeyDown === state.keyTarget) {
      // Target hit! Remove it from the current word.
      state.currentLine[0].shift()
      // If that word is empty, look at the next one.
      if (state.currentLine[0].length === 0) {
        state.currentLine.shift();
      }
      // If there are no words, create a new line.
      if (state.currentLine.length === 0) {
        state.lineLength++;
        state.wordLength++;
        state.currentLine = createLine(state.lineLength, state.wordLength);
      }
      // Assign the new target key.
      state.keyTarget = state.currentLine[0][0];
    }
  });
});



document.addEventListener('keyup', (ev) => {
  manageState(ev).then((event) => {
    updateDisplay();
  });
});