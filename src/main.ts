window.onload = () => {

    var c = document.getElementById("Mycanvas") as HTMLCanvasElement
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

    var type: MouseTouch;

    var move = false;
    window.onmousedown = (e_down) => {
        type = MouseTouch.MOUSE_DOWN;
        stage.handle(e_down, type);
        move = true;
        let beforeX = e_down.offsetX;
        let beforeY = e_down.offsetY;

        console.log("已记录");
        console.log("offSetX: " + e_down.offsetX + "  offSetY: " + e_down.offsetY);

        // bitmap1.addEventListener(MouseTouch.MOUSE_DOWN, () => {

        window.onmousemove = (e_move) => {
            console.log("开始移动")
            type = MouseTouch.MOUSE_MOVE;
            stage.handle(e_move, type);
            bitmap1.addEventListener(MouseTouch.MOUSE_MOVE, () => {
                context.setTransform(1, 0, 0, 1, 0, 0);
                context.clearRect(0, 0, 800, 800);
                let offSetX = e_move.offsetX - beforeX;
                let offSetY = e_move.offsetY - beforeY;
                bitmap1.x = e_move.clientX - offSetX;
                bitmap1.y = e_move.clientY - offSetY;
                console.log("bitmap1.x: " + (e_move.clientX - offSetX) + "  bitmap1.y: " + (e_move.clientY - offSetY));
                stage.draw(context);
            });

        }

        // });

    }


    window.onmouseup = (e) => {
        type = MouseTouch.MOUSE_UP;
        stage.handle(e, type);
        move = false;
        window.onmousemove = null;
    }

};




enum MouseTouch {
    MOUSE_UP = 1,
    MOUSE_DOWN = 2,
    MOUSE_MOVE = 3,
    MOUSE_CLICK = 0

}


// class MouseTouchEvent extends MouseEvent {
//     // TOUCH_UP = MouseTouch.MOUSE_UP;
//     // TOUCH_DOWN = MouseTouch.MOUSE_DOWN;
//     // TOUCH_MOVE = MouseTouch.MOUSE_MOVE;
//     // TOUCH_CLICK = MouseTouch.MOUSE_CLICK;
//     type:MouseTouch;
//     typeArg:string
//     stageX: number;
//     stageY: number;

//     constructor(type:MouseTouch){
//         switch(type){
//             case MouseTouch.MOUSE_UP:
//             this.typeArg = ""


//         }
//         super(type);

//     }
// }

interface IEventDispatcher {
    addEventListener(type: MouseTouch, listener: Function, useCapture?: boolean);
    removeEventListener(type: MouseTouch, listener: Function, useCapture?: boolean);
    dispatchEvent(event: MyEvent);
}


interface Drawable {
    draw(context: CanvasRenderingContext2D);
    hitTest(point: math.Point): DisplayObject;

}

class MyEvent {
    currentTarget: IEventDispatcher;
    target: IEventDispatcher;
    type: MouseTouch;
    cancelBubble = false;
    constructor(type: MouseTouch, target: IEventDispatcher, currentTarget: IEventDispatcher, cancelBubble?: boolean) {
        this.type = type;
        this.currentTarget = currentTarget;
        this.target = target;
        this.cancelBubble = cancelBubble;
    }

}

class EventDispatcher implements IEventDispatcher {
    //事件组
    totalEventArray: { event: MyEvent, listener: Function }[] = [];
    static dispatchEventArray: Function[] = []              //调度用eventArray；


    addEventListener(type: MouseTouch, listener: Function, useCapture?: boolean) {
        var thisObject: IEventDispatcher = this;
        var event = new MyEvent(type, null, thisObject, useCapture);

        this.totalEventArray.push({ event, listener });
    }
    removeEventListener(type: MouseTouch, listener: Function, useCapture?: boolean) {
        var thisObject: IEventDispatcher = this;
        var event = new MyEvent(type, null, thisObject, useCapture);

        var copyArray = this.totalEventArray;
        for (let currentEvent of this.totalEventArray) {
            if (currentEvent.event == event && currentEvent.listener == listener) {
                var index = this.totalEventArray.indexOf(currentEvent);
                copyArray.splice(index, 1);
            }
        }
        this.totalEventArray = copyArray;
    }

    //  事件触发器 获取事件流列表
    dispatchEvent(event: MyEvent) { }



    //事件执行方法
    eventDispatch() {//执行dispatchEventArray中所有的命令（都是目标正确的,），然后清空该列表
        for (let currentEvent of EventDispatcher.dispatchEventArray) {
            var fun = currentEvent();
        }
        EventDispatcher.dispatchEventArray = [];
    }

}


abstract class DisplayObject extends EventDispatcher implements Drawable {
    //坐标
    x = 0;
    y = 0;

    //透明度
    alpha = 1;
    protected globalAlpha = 1;

    //scale
    scaleX = 1;
    scaleY = 1;

    //旋转(度数 0~360)
    rotation = 0;

    /////////////////矩阵
    localMatrix = new math.Matrix(1, 0, 0, 1, 0, 0);
    globalMatrix = new math.Matrix(1, 0, 0, 1, 0, 0);

    //父容器
    parent: DisplayObjectContainer = null;



    draw(context: CanvasRenderingContext2D) {
        this.localMatrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);

        //alpha变化
        if (this.parent) {
            //alpha变化
            this.globalAlpha = this.parent.globalAlpha * this.alpha;
            //矩阵变化
            this.globalMatrix = math.matrixAppendMatrix(this.localMatrix, this.parent.globalMatrix);
        } else {
            this.globalAlpha = this.alpha;
            this.globalMatrix = this.localMatrix;

        }
        context.globalAlpha = this.globalAlpha;
        var gMatrix = this.globalMatrix;
        context.setTransform(gMatrix.a, gMatrix.b, gMatrix.c, gMatrix.d, gMatrix.tx, gMatrix.ty);
        this.render(context);

    }
    handle(e: MouseEvent, type: MouseTouch) {

        let x = e.offsetX;
        let y = e.offsetY;
        let targetPoint = new math.Point(x, y);
        let target = this.hitTest(targetPoint);
        let result = target;


        if (result) { //找到目标
            let event = new MyEvent(type, target, result);//（type , 当前目标，总目标）
            result.dispatchEvent(event);//发属于自己的第一条消息
            var i = 1;
            while (result.parent) {    //当有父时
                i++;
                let currentTarget = result.parent;//
                event = new MyEvent(type, target, currentTarget) //为父发消息
                result.parent.dispatchEvent(event);//           发送消息
                result = result.parent;
            };
            //没有parent了，开始执行所有listener
            this.eventDispatch();
        } else {
        }
    }


    dispatchEvent(event: MyEvent): boolean {//(查找这个物体是不是有eventlistener，如果有，)
        for (let targetEvent of this.totalEventArray) {
            if (targetEvent.event.currentTarget == event.currentTarget) {           //当前目标相同,
                // console.log("目标一致");
                if (targetEvent.event.type == event.type) {        //且事件类型一致，按顺序将其插入执行数组中
                    // console.log("类型一致");
                    console.log("插到队伍里去了");
                    if (targetEvent.event.cancelBubble) { //如果抓捕，方法插入队头
                        EventDispatcher.dispatchEventArray.unshift(targetEvent.listener);
                    } else { //冒泡，插入队尾
                        EventDispatcher.dispatchEventArray.push(targetEvent.listener);
                    }
                }
            }
            return true;
        }
        return false;
    }


    abstract render(context: CanvasRenderingContext2D)
    abstract hitTest(point: math.Point): DisplayObject;
}

class DisplayObjectContainer extends DisplayObject {
    children: DisplayObject[] = [];

    addChild(newObject: DisplayObject) {
        this.children.push(newObject);
        newObject.parent = this;
    }

    removeChild(displayObject: DisplayObject) {
        var copyArray = this.children
        for (let arrayobject of this.children) {
            if (arrayobject == displayObject) {
                var objectIndex = this.children.indexOf(arrayobject);
                copyArray.splice(objectIndex, 1);
                break;
            }
        }
        this.children = copyArray;
    }

    render(context: CanvasRenderingContext2D) {
        for (let c of this.children) {
            c.draw(context);
        }
    }


    hitTest(point: math.Point): DisplayObject {
        for (let i = this.children.length - 1; i >= 0; i--) {
            let child = this.children[i];
            let invertChildMatrix = math.invertMatrix(this.localMatrix);//逆矩阵
            let pointBaseOnChild = math.pointAppendMatrix(point, invertChildMatrix);//点 * 逆矩阵
            let hitTestResult = child.hitTest(pointBaseOnChild);//点击目标
            if (hitTestResult) {
                return hitTestResult;
            }
        }
        return null;
    }

}
/*
      位图
*/
class Bitmap extends DisplayObject {
    src = "";
    Img = new Image();

    private isLoaded = false;
    render(context: CanvasRenderingContext2D) {
        // this.Img.src = this.src
        // if (this.isLoaded) {
        //     context.drawImage(this.Img, 0, 0);

        // } else {
        //     this.Img.onload = () => {
        //         context.drawImage(this.Img, 0, 0);
        //         this.isLoaded = true;
        //     }
        // }

        this.Img.src = this.src;
        this.Img.onload = () => {
            context.drawImage(this.Img, 0, 0);
        }
        context.drawImage(this.Img, 0, 0);


    }

    hitTest(point: math.Point): DisplayObject {
        var rect = new math.Rectangle();
        rect.width = this.Img.width;
        rect.height = this.Img.height;
        let invertMatrix = math.invertMatrix(this.localMatrix);//逆矩阵
        var localPoint = math.pointAppendMatrix(point, invertMatrix);

        if (rect.isPointInRectangle(localPoint)) {
            return this;
        } else {
            return null
        }

    }


}
/*
      文本框 
 */

class TextField extends DisplayObject {
    text = "space";
    font = "Arial"
    size = 10;
    render(context: CanvasRenderingContext2D) {
        // var textField = new TextField();
        context.font = this.size + " " + this.font;
        context.fillText(this.text, 0, 0);
    }
    hitTest(point: math.Point): DisplayObject {

        var rect = new math.Rectangle();
        rect.width = this.size * this.text.length;
        rect.height = 20;
        if (rect.isPointInRectangle(point)) {
            return this;
        } else {
            return null
        }

    }

}
