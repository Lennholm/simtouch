;(function(document, window){
    var button = document.createElement("button"),
        active = false,
        touchId = null,
        mappings = {mousedown: "touchstart", mouseup: "touchend", mousemove: "touchmove", mouseover: "touchenter", mouseout: "touchleave"},
        interceptions = ["mouseover","mouseout","mouseenter","mouseleave","mousemove","mousedown","mouseup","click"];

    button.innerHTML = "Touch";
    button.style.backgroundColor = "#ccc";
    button.style.position = "fixed";
    button.style.left = "5px";
    button.style.top = "5px";
    button.disabled = !window.addEventListener || !document.createEvent;

    document.addEventListener("DOMContentLoaded", function(){
        document.body.appendChild(button);
    }, false);
    window.addEventListener("load", function(){
        document.body.appendChild(button);
    }, false);
    function intercept(event){
        event.stopPropagation();
        event.preventDefault();
        if (!touchId && /mousemove|mouseover|mouseout/.test(event.type))
            return;
        if (event.type == "click" && event.target == button){
            toggleSim();
        } else if (mappings[event.type]){
            if (event.type == "mousedown")
                touchId = parseInt(Math.random()*1e10);
            var dEvt = document.createEvent("HTMLEvents");
            dEvt.initEvent(mappings[event.type], true, true);
            dEvt.touches = [{
                clientX: event.clientX,
                clientY: event.clientY,
                force: 0,
                identifier: touchId,
                pageX: event.pageX,
                pageY: event.pageY,
                radiusX: 1,
                radiusY: 1,
                rotationAngle: 0,
                screenX: event.screenX,
                screenY: event.screenY,
                target: event.target
            }];
            dEvt.touches.item = function(i){
                return dEvt.touches[i] || null;
            };
            dEvt.touches.identifiedTouch = function(id){
                return dEvt.touches[0].identifier == id ? dEvt.touches[0] : null;
            };
            dEvt.targetTouches = dEvt.touches;
            dEvt.changedTouches = dEvt.touches;
            dEvt.relatedTarget = event.relatedTarget;
            dEvt.altKey = event.altKey;
            dEvt.ctrlKey = event.ctrlKey;
            dEvt.metaKey = event.metaKey;
            dEvt.shiftKey = event.shiftKey;
            event.target.dispatchEvent(dEvt);
            if (event.type == "mouseup")
                touchId = null;
        }
    }
    function toggleSim(){
        var i = 0, action = active ? "remove" : "add";
        if (active){
            button.style.backgroundColor = "#ccc";
            document.body.style.cursor = "";
        } else {
            button.style.backgroundColor = "green";
            document.body.style.cursor = "pointer";
        }
        for (; i < interceptions.length; i++){
            document.body[action + "EventListener"](interceptions[i], intercept, true);
        }
        active = !active;
    }
    button.addEventListener("click", toggleSim, false);
})(document, window);
