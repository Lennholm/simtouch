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
    function TouchList(list){
        list = list || [];
        list.item = function(i){
            return this[i] || null;
        }
        list.identifiedTouch = function(id){
            return this[0].identifier == id ? this[0] : null;
        }
        return list;
    }
    function appendProps(target, source, fieldList){
        for (var i = 0; i <fieldList.length; i++){
            target[fieldList[i]] = source[fieldList[i]];
        }
    }
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
            dEvt.changedTouches = TouchList([{
                force: 0,
                identifier: 0,
                radiusX: 1,
                radiusY: 1,
                rotationAngle: 0,
                target: isRel ? event.target : touchElem
            }]);
            appendProps(dEvt.changedTouches[0], event, ["clientX","clientY","pageX","pageY","screenX","screenY"]);
            dEvt.touches = event.type != "mouseup" ? dEvt.changedTouches : TouchList();
            dEvt.targetTouches = event.type != "mouseup" ? dEvt.touches : TouchList();
            appendProps(dEvt, event, ["relatedTarget","altKey","ctrlKey","metaKey","shiftKey"]);
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
