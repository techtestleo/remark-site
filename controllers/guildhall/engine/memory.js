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
