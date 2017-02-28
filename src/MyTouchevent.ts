class MyTouchevent {
	/**
	 * 鼠标事件
	 */
	Mouse_Event:MyEvent;
	/**
	 * 函数
	 */
	listener:(e?:MouseEvent)=>void;

	public constructor(Mouse_Event:MyEvent,listener:(e?:MouseEvent)=>void) {
		this.Mouse_Event = Mouse_Event;
		this.listener = listener;
	}
}