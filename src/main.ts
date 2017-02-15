window.onload = () => {

    var c = document.getElementById("mycanvas") as HTMLCanvasElement
    var cxt = c.getContext("2d");
    var stage = new DisplayObjectContainer();

    var bitmap = new Bitmap();
    bitmap.Img.src = "aa.png"
    bitmap.x = 100;
    bitmap.y = 100;
    stage.addChild(bitmap);
    stage.draw(cxt);

    setInterval(() => {
        bitmap.x += 10;
        cxt.clearRect(0, 0, 500, 500);
        stage.draw(cxt);
    }, 500)


};

interface Drawable {
    draw(context: CanvasRenderingContext2D);
}

class DisplayObjectContainer implements Drawable {

    x: number = 0;
    y: number = 0;

    CanvasArray: DisplayObjectContainer[] = [];

    addChild(newContext: DisplayObjectContainer) {
        this.CanvasArray.push(newContext);
    }

    draw(context: CanvasRenderingContext2D) {

        for (let c of this.CanvasArray) {
            c.draw(context);
        }
    }
}

class Bitmap extends DisplayObjectContainer {
    Img = new Image();
    draw(context: CanvasRenderingContext2D) {
        if (!this.Img.onload) {
            this.Img.onload = () => {
                context.drawImage(this.Img, this.x, this.y);
            }
        }
        context.drawImage(this.Img, this.x, this.y);
    }
}

class TextField extends DisplayObjectContainer {
    text: string = "space";

    draw(context: CanvasRenderingContext2D) {
        var textField = new TextField();

        context.fillText(this.text, this.x, this.y);
    }
}