interface Drawable {
	draw(context: CanvasRenderingContext2D);
	hitTest(point: math.Point): DisplayObject;

}
abstract class DisplayObject extends EventDispatcher implements Drawable {
	/**
	 * 坐标
	 */
	x = 0;
	y = 0;

	/**
	 * 透明度
	 */
	alpha = 1;
	protected globalAlpha = 1;

	/**
	 * 缩放(x,y)
	 */
	scaleX = 1;
	scaleY = 1;
	

	/**
	 * 旋转(度数 0~360)
	 */
	rotation = 0;

	/**
	 * 矩阵
	 */
	localMatrix = new math.Matrix(1, 0, 0, 1, 0, 0);
	/**
	 * 全球矩阵
	 */
	globalMatrix = new math.Matrix(1, 0, 0, 1, 0, 0);

	/**
	 * 父容器
	 */
	parent: DisplayObjectContainer = null;




	/**
	 * 绘制（包含清屏）
	 */
	draw(context: CanvasRenderingContext2D) {
		context.setTransform(1, 0, 0, 1, 0, 0);
		context.clearRect(0, 0, 1000, 1000);
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

	/**
	 * 事件触发器
	 */
	handle(e: MouseEvent, type: MouseState) {

		let x = e.offsetX;
		let y = e.offsetY;
		let targetPoint = new math.Point(x, y);
		let target = this.hitTest(targetPoint);
		let result = target;
		// console.log("type: " + type)
		if (result) { //找到目标
			let event = new MyEvent(type, target, result);//（type , 当前目标，总目标）
			result.dispatchEvent(event);//发属于自己的第一条消息
			while (result.parent) {    //当有父时
				let currentTarget = result.parent;//
				event = new MyEvent(type, target, currentTarget) //为父发消息
				result.parent.dispatchEvent(event);//           发送消息
				result = result.parent;
			};
			//没有parent了，开始执行所有listener
			EventDispatcher.eventDispatch(e);
		}
	}

	/**
	 * 事件派发器
	 */
	dispatchEvent(event: MyEvent): boolean {//(查找这个物体是不是有eventlistener，如果有，)
		for (let targetEvent of this.totalEventArray) {
			if (targetEvent.Mouse_Event.currentTarget == event.currentTarget) {           //当前目标相同,
				// console.log("目标一致");
				// console.log("targetEvent: " + targetEvent.Mouse_Event.type);
				// console.log("event: " + event.type);
				if (targetEvent.Mouse_Event.type == event.type) {        //且事件类型一致，按顺序将其插入执行数组中
					// console.log("类型一致");
					if (targetEvent.Mouse_Event.cancelBubble) { //如果抓捕，方法插入队头
						EventDispatcher.dispatchEventArray.unshift(targetEvent);
					} else { //冒泡，插入队尾
						EventDispatcher.dispatchEventArray.push(targetEvent);
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