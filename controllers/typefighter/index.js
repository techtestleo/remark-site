/*
----------------- Type fighter mini game -----------------

*/
class Game {
  capture = null;
  memory = null;
  view = null;
  constructor() {
    this.build();
  }
  reset(earnings) {
    this.capture = null;
    this.memory = null;
    this.view = null;
    document.body.removeChild(
      document.getElementById('master-container')
    )
    this.build(earnings);
  }
  build(earnings) {
    // Create the global game state
    this.memory = new MemoryState();
    // Bind the capture methods, with ref. to global state
    this.capture = new Capture(this.memory);
    // Create the game view, and bind to global state
    this.view = new View(this.memory);
    // logger
    /*
    
    this.capture = new Capture();

    this.memory = new Memory(this.capture);
    
    
    
    
    */
  }
}

const main = new Game();