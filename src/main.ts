window.onload = () => {

    var c = document.getElementById("Mycanvas") as HTMLCanvasElement
    var context = c.getContext("2d");
    context.fillStyle = "#FF0000";

    ///////////底层容器

    var stage = new DisplayObjectContainer();
    // ///////文字
    // var textF1 = new TextField();
    // textF1.text = "Hello World";
    // textF1.x = 150;
    // textF1.y = 50;


    // var textF2 = new TextField();
    // textF2.text = "Hello New";
    // textF2.x = 300;
    // textF2.y = 50;

    //////////图片
    var bitmap1 = new Bitmap();
    bitmap1.src = "aa.png";
    bitmap1.x = 300;

    var button = new Bitmap();
    button.src = "按钮.jpg";
    button.x = 300;

    var container1 = new DisplayObjectContainer();
    container1.x = 0;

    container1.addChild(bitmap1);
    container1.addChild(button);

    stage.addChild(container1);


    // bitmap1.addEventListener(MouseState.MOUSE_UP, () => {
    //     console.log("bitmap");
    // })
    // container1.addEventListener(MouseTouch.MOUSE_UP, () => {
    //     console.log("111");
    // }, true)
    // container2.addEventListener(MouseTouch.MOUSE_UP, () => {
    //     console.log("222");
    // })
    stage.draw(context);

    bitmap1.addEventListener(MouseState.MOUSE_MOVE, (e) => {
        console.log("e.offsetX: " + e.offsetX + "  e.offsetY: " + e.offsetY);
        container1.x += e.movementX;
        container1.y += e.movementY;
        // console.log("bitmap1.x: " + bitmap1.x + "  bitmap1.y: " + bitmap1.y);
        // console.log("container1.x: " + container1.x + "  container1.y: " + container1.y);
        stage.draw(context);
    });

    button.addEventListener(MouseState.MOUSE_CLICK, (e) => {
        alert("111");
    });

    window.onmousedown = (e) => {
        stage.handle(e, MouseState.MOUSE_DOWN);

        let downX = e.offsetX;
        let downY = e.offsetY;
        window.onmousemove = (e) => {
            stage.handle(e, MouseState.MOUSE_MOVE);

        }
        window.onmouseup = (e) => {
            stage.handle(e, MouseState.MOUSE_UP);
            window.onmousemove = (e) => { }
            let upX = e.offsetX;
            let upY = e.offsetY;
            let resultX = Math.abs(upX - downX);
            let resultY = Math.abs(upY - downY);
            if (resultX < 10 &&
                resultY < 10) {
                stage.handle(e, MouseState.MOUSE_CLICK);
            }
        }
    }

};



