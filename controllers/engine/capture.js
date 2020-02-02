class Capture {
  bindKeyUp(memoryRef) {
    console.log(memoryRef);
    document.addEventListener('keyup', (ev) => {
      memoryRef.keyUp(ev);
    });
  }
  bindKeyDown(memoryRef) {
    console.log(memoryRef);
    document.addEventListener('keydown', (ev) => {
      memoryRef.keyDown(ev);
      memoryRef.updateNotifications();
    });
  }
}