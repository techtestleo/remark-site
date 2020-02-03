# Guild Hall


Capture -> Memory -> View

When an event is captured, it is passed to the memory. The memory receives the event, and updates the variable(s) being mutated.  The event that caused the change is passed as an "action" to the view, which updates any elements that reference the mutation.

```
interface stateMap = {
  element_id: data
}
```

# Capture

The capture method takes in the source (`MouseEvent` or `KeyboardEvent`) and creates an `id`. The `id` of a `KeyboardEvent` will be prefaced with `key-[event.key]`. The `id` of a `MouseEvent` will be the `event.target.id` of the `MouseEvent`.

It passes these bundled events directly to the Memory.debounceEvent() method, without modifing the original event data.

# Memory.debounceEvent()

This method will only fire Memory.receiveEvent() if there are no active repaints occuring.

# Memory.receiveEvent()

This method takes in the bundled event from the Capture class listeners. It then uses the id to dispatch an action to the Memory.dispatch() method. 

# Memory.dispatch()

This method updates one or more variables in state by looking at the id of the action, and updating any state variables that have that id assiocated with it. It then looks at the stateMap table with the id's of any values mutated by the action, and returns the ids of any view elements that display data affected by this mutation, a completed status and the id of the original action in a bundled event. (Promise, resolves({completed action}))

# Memory.dispatch().then();

This cb occurs in Memory.receiveEvent(). Inside here, we call the View.update() method with the completed action resolved from Memory.dispatch()

# View.update();

This method first sets the memory debounce state to "painting = true". Then, it looks at all the ids that need to be updated in the completed action. It then calls view.repaint with each id to update.

# View.repaint()

This method looks at the stateMap table with the id it has been called with, and grabs that value. It then calls get element by ID in the document with each id, and sets the innerHtml to the value grabbed by looking at stateMap.

Once all repaints are complete we call Memory.completeEvent();

# Memory.completeEvent()

This method sets the memory "painting = true" state to false


We are now ready to receive new inputs.





