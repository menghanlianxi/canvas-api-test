var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
window.onload = function () {
    var c = document.getElementById("Mycanvas");
    var context = c.getContext("2d");
    context.fillStyle = "#FF0000";
    ///////////底层容器
    var stage = new DisplayObjectContainer();
    ///////文字
    var textF1 = new TextField();
    textF1.text = "Hello World";
    textF1.x = 150;
    textF1.y = 50;
    var textF2 = new TextField();
    textF2.text = "Hello New";
    textF2.x = 300;
    textF2.y = 50;
    //////////图片
    var bitmap1 = new Bitmap();
    bitmap1.src = "aa.png";
    bitmap1.x = 300;
    bitmap1.y = 300;
    stage.addChild(bitmap1);
    // // bitmap1.addEventListener(MouseTouch.MOUSE_UP, () => {
    // //     console.log("bitmap");
    // // })
    // container1.addEventListener(MouseTouch.MOUSE_UP, () => {
    //     console.log("111");
    // }, true)
    // container2.addEventListener(MouseTouch.MOUSE_UP, () => {
    //     console.log("222");
    // })
    stage.draw(context);
    var type;
    var move = false;
    window.onmousedown = function (e_down) {
        type = MouseTouch.MOUSE_DOWN;
        stage.handle(e_down, type);
        move = true;
        var beforeX = e_down.offsetX;
        var beforeY = e_down.offsetY;
        console.log("已记录");
        console.log("offSetX: " + e_down.offsetX + "  offSetY: " + e_down.offsetY);
        // bitmap1.addEventListener(MouseTouch.MOUSE_DOWN, () => {
        window.onmousemove = function (e_move) {
            console.log("开始移动");
            type = MouseTouch.MOUSE_MOVE;
            stage.handle(e_move, type);
            bitmap1.addEventListener(MouseTouch.MOUSE_MOVE, function () {
                context.setTransform(1, 0, 0, 1, 0, 0);
                context.clearRect(0, 0, 800, 800);
                var offSetX = e_move.offsetX - beforeX;
                var offSetY = e_move.offsetY - beforeY;
                bitmap1.x = e_move.clientX - offSetX;
                bitmap1.y = e_move.clientY - offSetY;
                console.log("bitmap1.x: " + (e_move.clientX - offSetX) + "  bitmap1.y: " + (e_move.clientY - offSetY));
                stage.draw(context);
            });
        };
        // });
    };
    window.onmouseup = function (e) {
        type = MouseTouch.MOUSE_UP;
        stage.handle(e, type);
        move = false;
        window.onmousemove = null;
    };
};
var MouseTouch;
(function (MouseTouch) {
    MouseTouch[MouseTouch["MOUSE_UP"] = 1] = "MOUSE_UP";
    MouseTouch[MouseTouch["MOUSE_DOWN"] = 2] = "MOUSE_DOWN";
    MouseTouch[MouseTouch["MOUSE_MOVE"] = 3] = "MOUSE_MOVE";
    MouseTouch[MouseTouch["MOUSE_CLICK"] = 0] = "MOUSE_CLICK";
})(MouseTouch || (MouseTouch = {}));
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
        this.totalEventArray.push({ event: event, listener: listener });
    };
    EventDispatcher.prototype.removeEventListener = function (type, listener, useCapture) {
        var thisObject = this;
        var event = new MyEvent(type, null, thisObject, useCapture);
        var copyArray = this.totalEventArray;
        for (var _i = 0, _a = this.totalEventArray; _i < _a.length; _i++) {
            var currentEvent = _a[_i];
            if (currentEvent.event == event && currentEvent.listener == listener) {
                var index = this.totalEventArray.indexOf(currentEvent);
                copyArray.splice(index, 1);
            }
        }
        this.totalEventArray = copyArray;
    };
    //  事件触发器 获取事件流列表
    EventDispatcher.prototype.dispatchEvent = function (event) { };
    //事件执行方法
    EventDispatcher.prototype.eventDispatch = function () {
        for (var _i = 0, _a = EventDispatcher.dispatchEventArray; _i < _a.length; _i++) {
            var currentEvent = _a[_i];
            var fun = currentEvent();
        }
        EventDispatcher.dispatchEventArray = [];
    };
    return EventDispatcher;
}());
EventDispatcher.dispatchEventArray = []; //调度用eventArray；
var DisplayObject = (function (_super) {
    __extends(DisplayObject, _super);
    function DisplayObject() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //坐标
        _this.x = 0;
        _this.y = 0;
        //透明度
        _this.alpha = 1;
        _this.globalAlpha = 1;
        //scale
        _this.scaleX = 1;
        _this.scaleY = 1;
        //旋转(度数 0~360)
        _this.rotation = 0;
        /////////////////矩阵
        _this.localMatrix = new math.Matrix(1, 0, 0, 1, 0, 0);
        _this.globalMatrix = new math.Matrix(1, 0, 0, 1, 0, 0);
        //父容器
        _this.parent = null;
        return _this;
    }
    DisplayObject.prototype.draw = function (context) {
        this.localMatrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);
        //alpha变化
        if (this.parent) {
            //alpha变化
            this.globalAlpha = this.parent.globalAlpha * this.alpha;
            //矩阵变化
            this.globalMatrix = math.matrixAppendMatrix(this.localMatrix, this.parent.globalMatrix);
        }
        else {
            this.globalAlpha = this.alpha;
            this.globalMatrix = this.localMatrix;
        }
        context.globalAlpha = this.globalAlpha;
        var gMatrix = this.globalMatrix;
        context.setTransform(gMatrix.a, gMatrix.b, gMatrix.c, gMatrix.d, gMatrix.tx, gMatrix.ty);
        this.render(context);
    };
    DisplayObject.prototype.handle = function (e, type) {
        var x = e.offsetX;
        var y = e.offsetY;
        var targetPoint = new math.Point(x, y);
        var target = this.hitTest(targetPoint);
        var result = target;
        if (result) {
            var event_1 = new MyEvent(type, target, result); //（type , 当前目标，总目标）
            result.dispatchEvent(event_1); //发属于自己的第一条消息
            var i = 1;
            while (result.parent) {
                i++;
                var currentTarget = result.parent; //
                event_1 = new MyEvent(type, target, currentTarget); //为父发消息
                result.parent.dispatchEvent(event_1); //           发送消息
                result = result.parent;
            }
            ;
            //没有parent了，开始执行所有listener
            this.eventDispatch();
        }
        else {
        }
    };
    DisplayObject.prototype.dispatchEvent = function (event) {
        for (var _i = 0, _a = this.totalEventArray; _i < _a.length; _i++) {
            var targetEvent = _a[_i];
            if (targetEvent.event.currentTarget == event.currentTarget) {
                // console.log("目标一致");
                if (targetEvent.event.type == event.type) {
                    // console.log("类型一致");
                    console.log("插到队伍里去了");
                    if (targetEvent.event.cancelBubble) {
                        EventDispatcher.dispatchEventArray.unshift(targetEvent.listener);
                    }
                    else {
                        EventDispatcher.dispatchEventArray.push(targetEvent.listener);
                    }
                }
            }
            return true;
        }
        return false;
    };
    return DisplayObject;
}(EventDispatcher));
var DisplayObjectContainer = (function (_super) {
    __extends(DisplayObjectContainer, _super);
    function DisplayObjectContainer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.children = [];
        return _this;
    }
    DisplayObjectContainer.prototype.addChild = function (newObject) {
        this.children.push(newObject);
        newObject.parent = this;
    };
    DisplayObjectContainer.prototype.removeChild = function (displayObject) {
        var copyArray = this.children;
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var arrayobject = _a[_i];
            if (arrayobject == displayObject) {
                var objectIndex = this.children.indexOf(arrayobject);
                copyArray.splice(objectIndex, 1);
                break;
            }
        }
        this.children = copyArray;
    };
    DisplayObjectContainer.prototype.render = function (context) {
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var c = _a[_i];
            c.draw(context);
        }
    };
    DisplayObjectContainer.prototype.hitTest = function (point) {
        for (var i = this.children.length - 1; i >= 0; i--) {
            var child = this.children[i];
            var invertChildMatrix = math.invertMatrix(this.localMatrix); //逆矩阵
            var pointBaseOnChild = math.pointAppendMatrix(point, invertChildMatrix); //点 * 逆矩阵
            var hitTestResult = child.hitTest(pointBaseOnChild); //点击目标
            if (hitTestResult) {
                return hitTestResult;
            }
        }
        return null;
    };
    return DisplayObjectContainer;
}(DisplayObject));
/*
      位图
*/
var Bitmap = (function (_super) {
    __extends(Bitmap, _super);
    function Bitmap() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.src = "";
        _this.Img = new Image();
        _this.isLoaded = false;
        return _this;
    }
    Bitmap.prototype.render = function (context) {
        // this.Img.src = this.src
        // if (this.isLoaded) {
        //     context.drawImage(this.Img, 0, 0);
        var _this = this;
        // } else {
        //     this.Img.onload = () => {
        //         context.drawImage(this.Img, 0, 0);
        //         this.isLoaded = true;
        //     }
        // }
        this.Img.src = this.src;
        this.Img.onload = function () {
            context.drawImage(_this.Img, 0, 0);
        };
        context.drawImage(this.Img, 0, 0);
    };
    Bitmap.prototype.hitTest = function (point) {
        var rect = new math.Rectangle();
        rect.width = this.Img.width;
        rect.height = this.Img.height;
        var invertMatrix = math.invertMatrix(this.localMatrix); //逆矩阵
        var localPoint = math.pointAppendMatrix(point, invertMatrix);
        if (rect.isPointInRectangle(localPoint)) {
            return this;
        }
        else {
            return null;
        }
    };
    return Bitmap;
}(DisplayObject));
/*
      文本框
 */
var TextField = (function (_super) {
    __extends(TextField, _super);
    function TextField() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.text = "space";
        _this.font = "Arial";
        _this.size = 10;
        return _this;
    }
    TextField.prototype.render = function (context) {
        // var textField = new TextField();
        context.font = this.size + " " + this.font;
        context.fillText(this.text, 0, 0);
    };
    TextField.prototype.hitTest = function (point) {
        var rect = new math.Rectangle();
        rect.width = this.size * this.text.length;
        rect.height = 20;
        if (rect.isPointInRectangle(point)) {
            return this;
        }
        else {
            return null;
        }
    };
    return TextField;
}(DisplayObject));
//# sourceMappingURL=main.js.map