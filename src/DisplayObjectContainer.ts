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

    /**
     * 碰撞检测
     */
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
        this.Img.src = this.src
        if (this.isLoaded) {
            context.drawImage(this.Img, 0, 0);
            // console.log("已加载打印")
        }
        else {
            this.Img.onload = () => {
                context.drawImage(this.Img, 0, 0);
                // console.log("未加载打印")
                this.isLoaded = true;
            }
        }

        // this.Img.src = this.src;
        // this.Img.onload = () => {
        //     context.drawImage(this.Img, 0, 0);

        // }
        // context.drawImage(this.Img, 0, 0);


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
