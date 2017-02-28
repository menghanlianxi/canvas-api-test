var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DisplayObject = (function (_super) {
    __extends(DisplayObject, _super);
    function DisplayObject() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * 坐标
         */
        _this.x = 0;
        _this.y = 0;
        /**
         * 透明度
         */
        _this.alpha = 1;
        _this.globalAlpha = 1;
        /**
         * 缩放(x,y)
         */
        _this.scaleX = 1;
        _this.scaleY = 1;
        /**
         * 旋转(度数 0~360)
         */
        _this.rotation = 0;
        /**
         * 矩阵
         */
        _this.localMatrix = new math.Matrix(1, 0, 0, 1, 0, 0);
        /**
         * 全球矩阵
         */
        _this.globalMatrix = new math.Matrix(1, 0, 0, 1, 0, 0);
        /**
         * 父容器
         */
        _this.parent = null;
        return _this;
    }
    /**
     * 绘制（包含清屏）
     */
    DisplayObject.prototype.draw = function (context) {
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, 1000, 1000);
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
    /**
     * 事件触发器
     */
    DisplayObject.prototype.handle = function (e, type) {
        var x = e.offsetX;
        var y = e.offsetY;
        var targetPoint = new math.Point(x, y);
        var target = this.hitTest(targetPoint);
        var result = target;
        // console.log("type: " + type)
        if (result) {
            var event_1 = new MyEvent(type, target, result); //（type , 当前目标，总目标）
            result.dispatchEvent(event_1); //发属于自己的第一条消息
            while (result.parent) {
                var currentTarget = result.parent; //
                event_1 = new MyEvent(type, target, currentTarget); //为父发消息
                result.parent.dispatchEvent(event_1); //           发送消息
                result = result.parent;
            }
            ;
            //没有parent了，开始执行所有listener
            EventDispatcher.eventDispatch(e);
        }
    };
    /**
     * 事件派发器
     */
    DisplayObject.prototype.dispatchEvent = function (event) {
        for (var _i = 0, _a = this.totalEventArray; _i < _a.length; _i++) {
            var targetEvent = _a[_i];
            if (targetEvent.Mouse_Event.currentTarget == event.currentTarget) {
                // console.log("目标一致");
                // console.log("targetEvent: " + targetEvent.Mouse_Event.type);
                // console.log("event: " + event.type);
                if (targetEvent.Mouse_Event.type == event.type) {
                    // console.log("类型一致");
                    if (targetEvent.Mouse_Event.cancelBubble) {
                        EventDispatcher.dispatchEventArray.unshift(targetEvent);
                    }
                    else {
                        EventDispatcher.dispatchEventArray.push(targetEvent);
                    }
                }
            }
            return true;
        }
        return false;
    };
    return DisplayObject;
}(EventDispatcher));
//# sourceMappingURL=DisplayObject.js.map