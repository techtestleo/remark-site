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
      });
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