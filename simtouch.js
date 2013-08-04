;(function(document, window){
    var button = document.createElement("button"),
        active = false,
        touchmove = false,
        mappings = {mousedown: "touchstart", mouseup: "touchend", mousemove: "touchmove"},
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
        if (event.type == "mousemove" && !touchmove)
            return;
        if (event.type == "click" && event.target == button){
            toggleSim();
        } else if (mappings[event.type]){
            var dEvt = document.createEvent("HTMLEvents");
            dEvt.initEvent(mappings[event.type], true, true);
            dEvt.touches = [{
                pageX: event.pageX,
                pageY: event.pageY
            }];
            event.target.dispatchEvent(dEvt);
            if (event.type == "mousedown")
                touchmove = true;
            if (event.type == "mouseup")
                touchmove = false;
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
