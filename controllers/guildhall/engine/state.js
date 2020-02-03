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