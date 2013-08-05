simtouch
========

Simulate touch events with the mouse pointer

This script will place a button labeled "Touch" in the top left corner of the page. When clicked, all mouse events (including **click** events) on the page will be disabled, instead the mouse will be used to simulate touch events.

Pressing down the mouse button will trigger a **touchstart** event, no other touch events are triggered unless **touchstart** happens. Moving the mouse pointer while pressing the button will trigger **touchmove** events, moving the mouse pointer over an element will trigger a **touchenter** event on that element, moving the mouse pointer away from an element will trigger a **touchleave** event on that element and releasing the mouse button will trigger a **touchend** event. The **touchcancel** event is never triggered.

The touch events conform to the *TouchEvent* interface specification, meaning they will have the *TouchLists* `touches`, `targetTouches` and `changedTouches`. Since only one touch point is possible, all these *TouchLists* are identical except on the **touchend** event where `touches` and `targetTouches` are empty. The *TouchEvent* also has the `relatedTarget` property and the required flags for modifier keys.

The *TouchLists* also conform to their interface specification meaning they have the getter methods `item()` and `identifiedTouch()`. Since only one touch point is possible, `0` is the only parameter value for `item()` that will return a *Touch* point.

Likewise, the *Touch* point conform to it's interface specification meaning it will have the coordinate properties `pageX`, `pageY`, `screenX`, `screenY`, `clientX` and `clientY` as well as `target`, `identifier` and mockups for `radiusX`, `radiusY`, `rotationAngle` and `force`.

(Source: W3C Touch Events version 2, https://dvcs.w3.org/hg/webevents/raw-file/default/touchevents.html)


When the simulation is active all touch events will be addes as properties to `window` and `Node.prototype` so that applications that utilize feature detections like `'ontouchstart' in document` will detect touch support and work. Feature detection that rely on `window.Touch` or `window.DocumentTouch` will not work with simtouch.


The simulation can be turned off by clicking the "Touch" button again.

simtouch requires a browser that supports `addEventListener()` and `document.createEvent()`


Demo
====

The demo consists of a square element with a pink background. When moving the mouse pointer over the element (mouseover), it will get a light blue background and print the mouse pointer coordinates as the mouse pointer is moved across it (mousemove). When the mouse pointer is moved away from the element (mouseout) it will be cleared and turned pink again. Clicking the element will give an alert pop-up.

On a touch device, the element will remain pink when touched (touchstart) and when moving the finger across the page it will follow the finger while printing the touch point coordinates (touchmove). When releasing the finger from the element (touchend) it will flash light green and the last touch point coordinates will remain visible.

When activating the simulation on a desktop browser by clicking the "Touch" button, you can see in action how the mouse pointer triggers the touch events in the same way your finger does on a touch device instead of the mouse events.
