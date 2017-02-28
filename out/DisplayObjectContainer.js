var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
    /**
     * 碰撞检测
     */
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
        var _this = this;
        this.Img.src = this.src;
        if (this.isLoaded) {
            context.drawImage(this.Img, 0, 0);
        }
        else {
            this.Img.onload = function () {
                context.drawImage(_this.Img, 0, 0);
                // console.log("未加载打印")
                _this.isLoaded = true;
            };
        }
        // this.Img.src = this.src;
        // this.Img.onload = () => {
        //     context.drawImage(this.Img, 0, 0);
        // }
        // context.drawImage(this.Img, 0, 0);
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
//# sourceMappingURL=DisplayObjectContainer.js.map