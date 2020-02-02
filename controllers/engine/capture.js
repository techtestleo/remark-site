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
}