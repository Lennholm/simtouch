simtouch
========

Simulate touch events with the mouse pointer

This script will place a button labeled "Touch" in the top left corner of the page. When clicked, all mouse events (including click events) on the page will be disabled, instead the mouse will be used to simulate touch events.

Pressing down the mouse button will trigger a touchstart event, moving the mouse pointer while pressing the button will trigger touchmove events and releasing the mouse button will trigger a touchend event. The touchcancel event is never triggered.

All triggered touch events will have a 'touches' array with a single entry. This single entry contains the properties 'pageX' and 'pageY' which are the mouse pointer's X and Y coordinates relative to the upper left corner of the page.


Demo
====

The demo consists of a square element with a pink background. When moving the mouse pointer over the element, it will get a light blue background and print the mouse pointer coordinates as the mouse pointer is moved across it. When the mouse pointer is moved away from the element it will be cleared and turned pink again. Clicking the element will give an alert pop-up.

On a touch device, the element will remain pink when touching the element and when moving the finger across the page it will follow the finger while printing the touch point coordinates. When releasing the finger from the element it will flash light green and the last touch point coordinates will remain visible.

When activating the simulation on a desktop browser by clicking the "Touch" button, the mouse pointer will have the same function as your finger has on a touch device.
