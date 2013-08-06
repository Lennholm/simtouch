;(function(document, window){
    var button = document.createElement("button"),
        active = false,
        touchElem = null,
        prevention = false,
        stopDispatch = false,
        moved = false,
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
        for (var i = 0; i < fieldList.length; i++){
            target[fieldList[i]] = source[fieldList[i]];
        }
    }
    function intercept(event){
        event.stopPropagation();
        event.preventDefault();
        var tEvt = mappings[event.type], isRel = /touchenter|touchleave/.test(tEvt);
        if (event.target == button && event.type == "click"){
            toggleSim();
            return;
        }
        if (touchElem === null && (isRel || tEvt == "touchmove"))
            return;
        if (tEvt == "touchmove"){
            if (stopDispatch)
                return;
            stopDispatch = !prevention;
            moved = true;
        }
        if (tEvt){
            if (tEvt == "touchstart"){
                touchElem = event.target;
                touchElem.addEventListener("touchstart", trackPrevention, false);
                touchElem.addEventListener("touchmove", trackPrevention, false);
                touchElem.addEventListener("touchend", defaultArbiter, false);
            }
            var dEvt = document.createEvent("HTMLEvents");
            dEvt.initEvent(tEvt, !isRel, true);
            dEvt.changedTouches = TouchList([{
                force: 0,
                identifier: 0,
                radiusX: 1,
                radiusY: 1,
                rotationAngle: 0,
                target: isRel ? event.target : touchElem
            }]);
            appendProps(dEvt.changedTouches[0], event, ["clientX","clientY","pageX","pageY","screenX","screenY"]);
            dEvt.touches = tEvt != "touchend" ? dEvt.changedTouches : TouchList();
            dEvt.targetTouches = dEvt.touches;
            appendProps(dEvt, event, ["relatedTarget","altKey","ctrlKey","metaKey","shiftKey"]);
            dEvt.changedTouches[0].target.dispatchEvent(dEvt);
            if (tEvt == "touchend"){
                touchElem = null;
                stopDispatch = moved = false;
            }
        }
    }
    function trackPrevention(event){
        prevention = event.defaultPrevented || prevention;
        if (event.type == "touchstart")
            this.removeEventListener("touchstart", trackPrevention, false);
    }
    function defaultArbiter(event){
        if (!prevention && touchElem != button && !moved){
            toggleInterceptions(false);
            dispatchMouseEvents(event);
            toggleInterceptions(active);
        }
        prevention = false;
        this.removeEventListener("touchmove", trackPrevention, false);
        this.removeEventListener("touchend", trackPrevention, false);
        this.removeEventListener("touchend", defaultArbiter, false);
    }
    function dispatchMouseEvents(event,click){
        var evts = ["mousemove","mousedown","mouseup","click"];
        for (var i = 0; i < evts.length; i++){
            var mEvt = document.createEvent("MouseEvents");
            mEvt.initEvent(evts[i], true, true);
            touchElem.dispatchEvent(mEvt);
        }
    }
    function toggleSim(){
        if (active){
            button.style.backgroundColor = "#ccc";
            document.body.style.cursor = "";
            for (var key in mappings){
                delete window["on" + mappings[key]];
                delete Node.prototype["on" + mappings[key]];
            }
        } else {
            button.style.backgroundColor = "green";
            document.body.style.cursor = "pointer";
            for (var key in mappings){
                window["on" + mappings[key]] = "simtouch";
                Node.prototype["on" + mappings[key]] = "simtouch";
            }
        }
        active = !active;
        toggleInterceptions(active);
    }
    function toggleInterceptions(activate){
        var i= 0, action = activate ? "add" : "remove";
        for (; i < interceptions.length; i++){
            document.body[action + "EventListener"](interceptions[i], intercept, true);
        }
    }
    button.addEventListener("click", toggleSim, false);
})(document, window);
