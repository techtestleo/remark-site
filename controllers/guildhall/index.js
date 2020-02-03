/**
 * Guild Hall
 */

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
      this.eventHandler(ev).then();
    });
    this.capture.bindKeyDown((ev) => {
      this.eventHandler(ev).then();
    });
    this.capture.bindClick((ev) => {
      this.eventHandler(ev).then();
    });
  }
  eventHandler = (ev) => {
    return new Promise((resolve, reject) => {
      this.debounceEvents(
        this.eventFormatter(ev)
      ).then((resolveEvent) => {
        if (resolveEvent !== null) {
          this.isPainting = true;
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

new Main();




