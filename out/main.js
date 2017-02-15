var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
window.onload = function () {
    var c = document.getElementById("mycanvas");
    var cxt = c.getContext("2d");
    var stage = new DisplayObjectContainer();
    var bitmap = new Bitmap();
    bitmap.Img.src = "aa.png";
    bitmap.x = 100;
    bitmap.y = 100;
    stage.addChild(bitmap);
    stage.draw(cxt);
    setInterval(function () {
        bitmap.x += 10;
        cxt.clearRect(0, 0, 500, 500);
        stage.draw(cxt);
    }, 500);
};
var DisplayObjectContainer = (function () {
    function DisplayObjectContainer() {
        this.x = 0;
        this.y = 0;
        this.CanvasArray = [];
    }
    DisplayObjectContainer.prototype.addChild = function (newContext) {
        this.CanvasArray.push(newContext);
    };
    DisplayObjectContainer.prototype.draw = function (context) {
        for (var _i = 0, _a = this.CanvasArray; _i < _a.length; _i++) {
            var c = _a[_i];
            c.draw(context);
        }
    };
    return DisplayObjectContainer;
}());
var Bitmap = (function (_super) {
    __extends(Bitmap, _super);
    function Bitmap() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.Img = new Image();
        return _this;
    }
    Bitmap.prototype.draw = function (context) {
        var _this = this;
        if (!this.Img.onload) {
            this.Img.onload = function () {
                context.drawImage(_this.Img, _this.x, _this.y);
            };
        }
        context.drawImage(this.Img, this.x, this.y);
    };
    return Bitmap;
}(DisplayObjectContainer));
var TextField = (function (_super) {
    __extends(TextField, _super);
    function TextField() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.text = "space";
        return _this;
    }
    TextField.prototype.draw = function (context) {
        var textField = new TextField();
        context.fillText(this.text, this.x, this.y);
    };
    return TextField;
}(DisplayObjectContainer));
//# sourceMappingURL=main.js.map