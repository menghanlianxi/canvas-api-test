var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
window.onload = function () {
    var c = document.getElementById("mycanvas");
    var context = c.getContext("2d");
    var stage = new DisplayObjectContainer();
    stage.alpha = 0.5;
    var bitmap = new Bitmap();
    bitmap.setSrc("aa.png");
    bitmap.x = 100;
    bitmap.y = 100;
    bitmap.alpha = 0.5;
    bitmap.rotation = 30;
    stage.addChild(bitmap);
    bitmap.scaleX = 0.5;
    setInterval(function () {
        bitmap.x += 10;
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, 500, 500);
        stage.draw(context);
    }, 500);
};
var DisplayObject = (function () {
    function DisplayObject() {
        this.x = 0;
        this.y = 0;
        this.alpha = 1;
        this.globalAlpha = 1;
        this.scaleX = 1;
        this.scaleY = 1;
        this.rotation = 0;
        this.matrix = new math.Matrix(1, 0, 0, 1, 0, 0);
        this.globalMatrix = new math.Matrix(1, 0, 0, 1, 0, 0);
        this.parent = null;
    }
    DisplayObject.prototype.draw = function (context) {
        this.matrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);
        if (this.parent) {
            this.globalAlpha = this.parent.globalAlpha * this.alpha;
            this.globalMatrix = math.matrixAppendMatrix(this.parent.globalMatrix, this.matrix); //this.parent.globalMatrix * this.matrix;
        }
        else {
            this.globalAlpha = this.alpha;
            this.globalMatrix = this.matrix;
        }
        context.globalAlpha = this.globalAlpha;
        var gMatrix = this.globalMatrix;
        context.setTransform(gMatrix.a, gMatrix.b, gMatrix.c, gMatrix.d, gMatrix.tx, gMatrix.ty);
        this.render(context);
    };
    DisplayObject.prototype.render = function (context) { };
    return DisplayObject;
}());
var DisplayObjectContainer = (function (_super) {
    __extends(DisplayObjectContainer, _super);
    function DisplayObjectContainer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.CanvasArray = [];
        return _this;
    }
    DisplayObjectContainer.prototype.addChild = function (newObject) {
        this.CanvasArray.push(newObject);
        newObject.parent = this;
    };
    DisplayObjectContainer.prototype.removeChild = function (displayObject) {
        var copyArray = this.CanvasArray;
        for (var _i = 0, _a = this.CanvasArray; _i < _a.length; _i++) {
            var arrayobject = _a[_i];
            if (arrayobject == displayObject) {
                var objectIndex = this.CanvasArray.indexOf(arrayobject);
                copyArray.splice(objectIndex, 1);
                break;
            }
        }
        this.CanvasArray = copyArray;
    };
    DisplayObjectContainer.prototype.render = function (context) {
        for (var _i = 0, _a = this.CanvasArray; _i < _a.length; _i++) {
            var c = _a[_i];
            c.draw(context);
        }
    };
    return DisplayObjectContainer;
}(DisplayObject));
var Bitmap = (function (_super) {
    __extends(Bitmap, _super);
    function Bitmap() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.Img = new Image();
        _this.isLoaded = false;
        return _this;
    }
    Bitmap.prototype.setSrc = function (src) {
        var _this = this;
        this.Img.src = src;
        this.Img.onload = function () {
            _this.isLoaded = true;
        };
    };
    Bitmap.prototype.render = function (context) {
        var _this = this;
        if (this.isLoaded) {
            context.drawImage(this.Img, 0, 0);
        }
        else {
            this.Img.onload = function () {
                context.drawImage(_this.Img, 0, 0);
            };
            this.isLoaded = true;
        }
    };
    return Bitmap;
}(DisplayObject));
//# sourceMappingURL=main.js.map