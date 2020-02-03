/**
 * Guild Hall
 */

class RawState {
  foo = 'hello';
  bar = 'world';
  baz = 'again'
}

class StateMap {
  raw = new RawState();
  stateMap = {
    clicks: {
      elementID_A: {
        value: this.raw.foo,
        updates: ['elementID_B']
      },
      elementID_B: {
        value: this.raw.bar,
        updates: ['elementID_C']
      },
      elementID_C: {
        value: this.raw.baz,
        updates: ['elementID_A']
      }
    }
  }
}


class Main {
  capture = null;
  memory = null;
  view = null;
  isPainting = false;
  state = null;
  constructor() {
    this.state = new StateMap();

    this.build();

    this.bind();
  }
  build() {

    this.view = new View(this.state);

    this.memory = new Memory(this.state);

    this.capture = new Capture();
  }
  bind() {
    this.capture.bindKeyUp((ev) => {
      this.eventHandler(ev).then((res) => {
      });
    });
    this.capture.bindKeyDown((ev) => {
      this.eventHandler(ev).then((res) => {
      });
    });
    this.capture.bindClick((ev) => {
      this.eventHandler(ev).then((res) => {
      });
    });
  }
  eventHandler = (ev) => {
    return new Promise((resolve, reject) => {
      this.debounceEvents(
        this.eventFormatter(ev)
      ).then((resolveEvent) => {
        if (resolveEvent !== null) {
          // update the view
          this.view.update(resolveEvent).then(() => {
            this.isPainting = false;
            resolve(resolveEvent);
          });
        } else {
          this.isPainting = false;
          resolve(resolveEvent);
        }
      });
    })
  }
  debounceEvents(formattedEvent) {
    return new Promise((resolve, reject) => {
      if (!this.isPainting) {
        this.memory.receiveEvents(formattedEvent).then((result) => {
          resolve(result);
        });
      } else {
        resolve(null);
      }
    })
  }
  eventFormatter(ev) {
    return {
      event: ev,
      id: ev.target.id ? ev.target.id : `key-${ev.key}`,
      type: ev.key ? 'keyboard' : 'mouse'
    }
  }
}



class Memory {
  stateMap = null;
  constructor(options) {
    this.stateMap = options.stateMap;
  }
  receiveEvents(formattedEvent) {
    return new Promise((resolve, reject) => {
      this.dispatch(formattedEvent).then((completedEvent) => {
        resolve(completedEvent);
      });
    })

  }
  dispatch(formattedEvent) {
    return new Promise((resolve, reject) => {
      // memory updates
      if (formattedEvent.type === 'mouse') {
        // click events occur on buttons.
        // buttons increment or decement, based on their context
        // an increment button looks like this:
        // elementID_C-btn-inc
        let idParts = formattedEvent.id.split('-');
        let toUpdate = this.stateMap.clicks[idParts[0]];
        // modify the updateValue
        // toUpdate.value++;
        // resolve & do screen updates
        resolve({
          toUpdate: toUpdate ? toUpdate.updates : [],
          value: toUpdate ? toUpdate.value : null,
          originId: formattedEvent.id
        });

      } else if (formattedEvent.type === 'keyboard') {
        // handle keyboard events
        resolve({
          toUpdate: [],
          value: null,
          originId: null
        });
      }

    })
  }
}

class Capture {
  bindKeyUp(handler) {
    document.addEventListener('keyup', (ev) => {
      handler(ev);
    });
  }
  bindKeyDown(handler) {
    document.addEventListener('keydown', (ev) => {
      handler(ev);
    });
  }
  bindClick(handler) {
    document.addEventListener('pointerdown', (ev) => {
      handler(ev);
    })
  }
}

class View {
  stateMap = null;
  viewContainer = document.createElement('div')
  constructor(options) {
    this.stateMap = options.stateMap;
    this.setup();
  }
  setup() {
    document.getElementsByClassName('footnotes')[0].appendChild(this.viewContainer);
    this.viewContainer.id = 'view-box';
  }
  update(completedEvent) {
    return new Promise((resolve, reject) => {
      completedEvent.toUpdate.forEach((id_ref) => {
        this.repaint(id_ref, completedEvent.value);
      })
      resolve();
    });
  }
  repaint(id_ref, mutatedValue) {
    let chosenElement = document.getElementById(id_ref);
    if (chosenElement) {
      chosenElement.innerHTML = mutatedValue;
    }
  }
}

new Main();




