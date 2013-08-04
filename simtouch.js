;(function(document, window){
    var button = document.createElement("button"),
        active = false,
        touchElem = null,
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
        var isRel = /mouseover|mouseout/.test(event.type);
        if (touchElem === null && (isRel || event.type == "mousemove"))
            return;
        if (event.type == "click" && event.target == button){
            toggleSim();
        } else if (mappings[event.type]){
            if (event.type == "mousedown")
                touchElem = event.target;
            var dEvt = document.createEvent("HTMLEvents");
            dEvt.initEvent(mappings[event.type], !isRel, true);
            dEvt.changedTouches = [{
                clientX: event.clientX,
                clientY: event.clientY,
                force: 0,
                identifier: 0,
                pageX: event.pageX,
                pageY: event.pageY,
                radiusX: 1,
                radiusY: 1,
                rotationAngle: 0,
                screenX: event.screenX,
                screenY: event.screenY,
                target: isRel ? event.target : touchElem
            }];
            dEvt.changedTouches.item = function(i){
                return dEvt.changedTouches[i] || null;
            };
            dEvt.changedTouches.identifiedTouch = function(id){
                return dEvt.changedTouches[0].identifier == id ? dEvt.changedTouches[0] : null;
            };
            dEvt.touches = event.type != "mouseup" ? dEvt.changedTouches : null;
            dEvt.targetTouches = event.type != "mouseup" ? dEvt.touches : null;
            dEvt.relatedTarget = event.relatedTarget;
            dEvt.altKey = event.altKey;
            dEvt.ctrlKey = event.ctrlKey;
            dEvt.metaKey = event.metaKey;
            dEvt.shiftKey = event.shiftKey;
            dEvt.changedTouches[0].target.dispatchEvent(dEvt);
            if (event.type == "mouseup")
                touchElem = null;
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
