var MyEvent = (function () {
    function MyEvent(type, target, currentTarget, cancelBubble) {
        this.cancelBubble = false;
        this.type = type;
        this.currentTarget = currentTarget;
        this.target = target;
        this.cancelBubble = cancelBubble;
    }
    return MyEvent;
}());
var EventDispatcher = (function () {
    function EventDispatcher() {
        //事件组
        this.totalEventArray = [];
    }
    EventDispatcher.prototype.addEventListener = function (type, listener, useCapture) {
        var thisObject = this;
        var event = new MyEvent(type, null, thisObject, useCapture);
        var newTouchEvent = new MyTouchevent(event, listener);
        this.totalEventArray.push(newTouchEvent);
    };
    EventDispatcher.prototype.removeEventListener = function (type, listener, useCapture) {
        var thisObject = this;
        var event = new MyEvent(type, null, thisObject, useCapture);
        var copyArray = this.totalEventArray;
        for (var _i = 0, _a = this.totalEventArray; _i < _a.length; _i++) {
            var currentEvent = _a[_i];
            if (currentEvent.Mouse_Event == event && currentEvent.listener == listener) {
                var index = this.totalEventArray.indexOf(currentEvent);
                copyArray.splice(index, 1);
            }
        }
        this.totalEventArray = copyArray;
    };
    //  事件触发器 获取事件流列表
    EventDispatcher.prototype.dispatchEvent = function (event) { };
    //执行事件
    EventDispatcher.eventDispatch = function (e) {
        for (var _i = 0, _a = EventDispatcher.dispatchEventArray; _i < _a.length; _i++) {
            var currentEvent = _a[_i];
            currentEvent.listener(e);
        }
        EventDispatcher.dispatchEventArray = [];
    };
    return EventDispatcher;
}());
EventDispatcher.dispatchEventArray = []; //调度用eventArray；
var MouseState;
(function (MouseState) {
    MouseState[MouseState["MOUSE_UP"] = 1] = "MOUSE_UP";
    MouseState[MouseState["MOUSE_DOWN"] = 2] = "MOUSE_DOWN";
    MouseState[MouseState["MOUSE_MOVE"] = 3] = "MOUSE_MOVE";
    MouseState[MouseState["MOUSE_CLICK"] = 0] = "MOUSE_CLICK";
})(MouseState || (MouseState = {}));
//# sourceMappingURL=EventDispatcher.js.map