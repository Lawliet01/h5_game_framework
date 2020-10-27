export default class BaseComponent {
	constructor() {
		this.beforeCreate();

		this._eventQueue = [];
		this._eventListeners = new Map();
		this.children = [];
		this.parent = null;
		this.on("destroy", (element) => {
			this.children = this.children.filter((e) => e !== element);
		});

		this.created();
	}
	/**
	 * 组件间交流机制
	 */
	hasEventListener(name) {
		// 查看有无事件监听
		return this._eventListeners.has(name);
	}
	on(name, handler) {
		// 添加事件监听，监听来自Game派发的事件
		this._eventListeners.set(name, handler);
	}
	off(name, handler) {
		// 移除事件监听
		this._eventListeners.delete(name);
	}
	triggerEvent(name, data) {
		// 把事件添加到队列上, 待下一帧执行
		if (!this._eventListeners.has(name)) return;
		const handler = this._eventListeners.get(name);
		handler.eventName = name; // 用于避免重复执行相同的事件
		this._eventQueue.push(function () {
			return handler(data);
		});
	}
	sendEvent(target, eventName, data) {
		// 发送事件到其他组件上面
		if (typeof target.triggerEvent === "function") {
			target.triggerEvent(eventName, data);
		}
	}
	executeEvent() {
		// 执行队列上的事件
		while (this._eventQueue.length) {
			const handler = this._eventQueue.shift();
			if (this._eventQueue.length && this._eventQueue[0].eventName === handler.eventName) continue;
			handler();
		}
	}
	/**
	 * 创建、销毁以及生命周期
	 */
	createChildren(Constructor, x, y, w, h) {
		// debugger
		const child = new Constructor(x, y, w, h);
		this.children.push(child);
		child.setParent(this);
		return child;
	}
	setParent(parent) {
		this.parent = parent;
	}
	destroy() {
		this.beforeDestroy();

		this.sendEvent(this.parent, "destroy", this);

		this.destroyed({});
	}
	beforeCreate() {}
	created() {}
	beforeUpdate() {}
	updated() {}
	beforeDestroy() {}
	destroyed() {}
}