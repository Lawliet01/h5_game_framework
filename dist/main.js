/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./common/utils.js":
/*!*************************!*\
  !*** ./common/utils.js ***!
  \*************************/
/*! namespace exports */
/*! export bfs [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "bfs": () => /* binding */ bfs
/* harmony export */ });
function bfs(node, func){
    const search = Array.isArray(node)?[...node]:[node]
    while (search.length) {
        const currNode = search.shift()
        func(currNode);
        if (Array.isArray(currNode.children)) {
			search.push(...currNode.children);
		}
    }
}

/***/ }),

/***/ "./core/baseComponent.js":
/*!*******************************!*\
  !*** ./core/baseComponent.js ***!
  \*******************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ BaseComponent
/* harmony export */ });
class BaseComponent {
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

/***/ }),

/***/ "./core/baseElement.js":
/*!*****************************!*\
  !*** ./core/baseElement.js ***!
  \*****************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _baseComponent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./baseComponent */ "./core/baseComponent.js");


class BaseElement extends _baseComponent__WEBPACK_IMPORTED_MODULE_0__.default {
	constructor(x = 0, y = 0, width = 0, height = 0) {
		super();
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.collisionListener = new Map();
		this.collistionHandleQueue = []
	}
	update() {
		// 自定义每一帧更新的逻辑
	}
	updateFrame() {
		this.executeEvent();
		this.update();
	}
	render(ctx) {
		// 如果有自己的渲染逻辑的话可以覆盖
		ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
	}
	setPos(x, y) {
		this.x = x;
		this.y = y;
	}
	/**
	 * 碰撞管理
	 */
	setCollistionListener(elementType, handler) {
		this.collisionListener.set(elementType, ()=>{
			this.collistionHandleQueue.push((...args)=>{
				return handler.call(this, ...args)
			})
		});
	}
	executeCollistionQueue(){
		while(this.collistionHandleQueue.length){
			const handler = this.collistionHandleQueue.shift();
			handler()
		}
	}
}

// 初始化config
// 属性
// 方法 生成（静态方法）、
// 事件
// 生命周期 created、updated、destroyed

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BaseElement);

/***/ }),

/***/ "./core/baseGame.js":
/*!**************************!*\
  !*** ./core/baseGame.js ***!
  \**************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _baseComponent__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./baseComponent */ "./core/baseComponent.js");
/* harmony import */ var _gesture_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./gesture.js */ "./core/gesture.js");
/* harmony import */ var common_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! common/utils */ "./common/utils.js");
/* harmony import */ var _renderer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./renderer.js */ "./core/renderer.js");






class Game extends _baseComponent__WEBPACK_IMPORTED_MODULE_1__.default {
	constructor() {
		super();
		this._createCanvas()
		this._handlePageEvent();
	}
	_createCanvas(){
		const canvas = document.createElement('canvas')
		canvas.width = window.screen.width;
		canvas.height = window.screen.height;
		this.canvas = canvas
		;(0,_gesture_js__WEBPACK_IMPORTED_MODULE_2__.default)(canvas);
		this.renderer = new _renderer_js__WEBPACK_IMPORTED_MODULE_0__.default(canvas);
		document.body.style.overflow = "hidden";
		document.body.style.margin = 0;
		document.body.appendChild(canvas)
	}
	_handlePageEvent() {
		// 提供管理事件能力
		this.canvas.addEventListener("panstart", (event) => {
			const pan = (event) => {
				dispatchToActors("pan", event, false);
			};

			const panend = (event) => {
				dispatchToActors("panend", event, false);
				this.canvas.removeEventListener("pan", pan);
				this.canvas.removeEventListener("panend", panend);
			};

			const dispatchToActors = (eventName, event, targetOnElement) => {
				const child = this.children.filter((child) => child.hasEventListener(eventName));

				const { clientX, clientY } = event.detail;
				for (let actor of this.children) {
					const { x, y, width, height } = actor;
					if (
						!targetOnElement ||
						(clientX > x && clientY > y && clientX < x + width && clientY < y + height)
					) {
						this.sendEvent(actor, eventName, event.detail);
					}
				}
			};

			dispatchToActors("panstart", event, true);

			this.canvas.addEventListener("pan", pan);

			this.canvas.addEventListener("panend", panend);
		});
	}
	/**
	 * 处理碰撞
	 */
	handleCollistion() {
		(0,common_utils__WEBPACK_IMPORTED_MODULE_3__.bfs)(this.children, (child) => {
			if (child.collisionListener.size) {
				(0,common_utils__WEBPACK_IMPORTED_MODULE_3__.bfs)(this.children, (otherChild) => {
					if (child.collisionListener.has(otherChild.type) && testCollistion(child, otherChild)) {
						const handler = child.collisionListener.get(otherChild.type);
						handler(otherChild);
					}
				});
			}
		});

		(0,common_utils__WEBPACK_IMPORTED_MODULE_3__.bfs)(this.children, (child)=>{
			child.executeCollistionQueue();
		})

		function testCollistion(elementA, elementB) {
			let { x: x1, y: y1, width: width1, height: height1 } = elementA;
			let { x: x2, y: y2, width: width2, height: height2 } = elementB;
			return (
				(x1 <= x2 && x1 + width1 >= x2 && y1 <= y2 && y1 + height1 >= y2) ||
				(x1 <= x2 + width2 && x1 + width1 >= x2 + width2 && y1 <= y2 && y1 + height1 >= y2) ||
				(x1 <= x2 && x1 + width1 >= x2 && y1 <= y2 + height2 && y1 + height1 >= y2 + height2) ||
				(x1 <= x2 + width2 && x1 + width1 >= x2 + width2 && y1 <= y2 + height2 && y1 + height1 >= y2 + height2)
			);
		}
	}
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Game);


/***/ }),

/***/ "./core/gesture.js":
/*!*************************!*\
  !*** ./core/gesture.js ***!
  \*************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ enableGesture
/* harmony export */ });
function enableGesture(e) {
	let context = {};

	e.addEventListener("touchstart", (event) => {
		event.stopPropagation();

		window.addEventListener("touchmove", move);
		window.addEventListener("touchend", end);

		context = {};

		if (event.changedTouches.length > 1) return;

		Object.assign(context, {
			startX: event.changedTouches[0].clientX,
			startY: event.changedTouches[0].clientY,
			isTap: true,
			timeoutHandler: setTimeout(() => {
				if (context.isTap && !context.isPan) {
					context.isTap = false;
					context.isPress = true;
					newEventDispatch("pressstart", {
						startX: event.changedTouches[0].clientX,
						startY: event.changedTouches[0].clientY,
					});
				}
			}, 500),
		});
	});

	const move = throttle((event) => {
		if (event.changedTouches.length > 1) {
			console.log("resize");
			return;
		}

		const { clientX, clientY } = event.changedTouches[0];

		if ((clientX - context.startX) ** 2 + (clientY - context.startY) ** 2 > 100) {
			if (context.isPan) {
				newEventDispatch("pan", {
					startX: context.startX,
					startY: context.startY,
					clientX,
					clientY,
				});
			} else {
				context.isPan = true;
				newEventDispatch("panstart", {
					clientX: context.startX,
					clientY: context.startY,
				});
			}
		}
	}, 16);

	const end = (event) => {
		if (context.isResize) console.log("resizeend");

		const { clientX, clientY } = event.changedTouches[0];

		if (context.isTap)
			newEventDispatch("tap", {
				startX: context.startX,
				startY: context.startY,
			});
		if (context.isPan)
			newEventDispatch("panend", {
				startX: context.startX,
				startY: context.startY,
				clientX,
				clientY,
			});
		if (context.isPress) newEventDispatch("pressend");

		clearTimeout(context.timeoutHandler);
		window.removeEventListener("touchmove", move);
		window.removeEventListener("touchend", end);
	};

	function newEventDispatch(name, config) {
		const event = document.createEvent("CustomEvent");
		event.initCustomEvent(name, false, false, config);
		e.dispatchEvent(event);
	}
}

function throttle(func, duration) {
	let enable = true;
	return function (...args) {
		if (enable) {
			enable = false;
			func.apply(this, args);
			setTimeout(() => {
				enable = true;
			}, duration);
		}
	};
}


/***/ }),

/***/ "./core/renderer.js":
/*!**************************!*\
  !*** ./core/renderer.js ***!
  \**************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ Renderer
/* harmony export */ });
/* harmony import */ var common_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! common/utils */ "./common/utils.js");


class Renderer {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
	}
	clear() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
	render(actors) {
		this.clear();
		(0,common_utils__WEBPACK_IMPORTED_MODULE_0__.bfs)(actors, (eachNode) => {
			// debugger
			eachNode.render(this.ctx);
		});
	}
}


/***/ }),

/***/ "./core/runtime.js":
/*!*************************!*\
  !*** ./core/runtime.js ***!
  \*************************/
/*! namespace exports */
/*! export runAnimation [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "runAnimation": () => /* binding */ runAnimation
/* harmony export */ });
function runAnimation(frameFunc) {
	let lastTime = null;
	function frame(time) {
		if (lastTime != null) {
			let timeStep = Math.min(time - lastTime, 100) / 1000;
			if (frameFunc(timeStep) === false) return;
		}
		lastTime = time;
		requestAnimationFrame(frame);
	}
	requestAnimationFrame(frame);
}


/***/ }),

/***/ "./games/planeGame/src/customElement.js":
/*!**********************************************!*\
  !*** ./games/planeGame/src/customElement.js ***!
  \**********************************************/
/*! namespace exports */
/*! export EggElement [provided] [no usage info] [missing usage info prevents renaming] */
/*! export MonsterElement [provided] [no usage info] [missing usage info prevents renaming] */
/*! export PlaneElement [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EggElement": () => /* binding */ EggElement,
/* harmony export */   "PlaneElement": () => /* binding */ PlaneElement,
/* harmony export */   "MonsterElement": () => /* binding */ MonsterElement
/* harmony export */ });
/* harmony import */ var _image_egg_png__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./image/egg.png */ "./games/planeGame/src/image/egg.png");
/* harmony import */ var _image_plane_png__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./image/plane.png */ "./games/planeGame/src/image/plane.png");
/* harmony import */ var _image_fire_png__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./image/fire.png */ "./games/planeGame/src/image/fire.png");
/* harmony import */ var _image_monster_png__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./image/monster.png */ "./games/planeGame/src/image/monster.png");
/* harmony import */ var core_baseElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core/baseElement.js */ "./core/baseElement.js");






class EggElement extends core_baseElement_js__WEBPACK_IMPORTED_MODULE_4__.default {
	constructor(x, y, w, h) {
		super(x, y, w, h);
		this.image = new Image();
		this.image.src = _image_egg_png__WEBPACK_IMPORTED_MODULE_0__.default;
		this.setCollistionListener("monster", () => this.destroy());
	}
	update() {
		this.y -= 30;
		if (this.y < 0) this.destroy();
	}
	get type() {
		return "egg";
	}
}

class MonsterElement extends core_baseElement_js__WEBPACK_IMPORTED_MODULE_4__.default {
	constructor(x, y, w, h) {
		super(x, y, w, h);
		this.image = new Image();
		this.image.src = _image_monster_png__WEBPACK_IMPORTED_MODULE_3__.default;
		this.setCollistionListener("egg", () => this.destroy());
        this.setCollistionListener("plane", () => this.destroy());
	}
	update() {
		this.y += 5;
		if (this.y >= window.screen.height) this.destroy();
	}
	get type() {
		return "monster";
	}
}

class PlaneElement extends core_baseElement_js__WEBPACK_IMPORTED_MODULE_4__.default {
	constructor(x, y, w, h) {
		super(x, y, w, h);
		this.image = new Image();
		this.image.src = _image_plane_png__WEBPACK_IMPORTED_MODULE_1__.default;
		this.fireCD = 0;
		this.setCollistionListener("monster", () => alert('you lose'));

	}
	update() {
		if (this.fireCD === 0) {
			this.createChildren(EggElement, this.x, this.y, 50, 70);
			this.fireCD = 10;
		} else {
			this.fireCD--;
		}
	}
	get type() {
		return "plane";
	}
}




/***/ }),

/***/ "./games/planeGame/src/index.js":
/*!**************************************!*\
  !*** ./games/planeGame/src/index.js ***!
  \**************************************/
/*! namespace exports */
/*! exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _customElement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./customElement.js */ "./games/planeGame/src/customElement.js");
/* harmony import */ var core_runtime_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core/runtime.js */ "./core/runtime.js");
/* harmony import */ var core_baseGame_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core/baseGame.js */ "./core/baseGame.js");
/* harmony import */ var common_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! common/utils */ "./common/utils.js");





class PlaneGame extends core_baseGame_js__WEBPACK_IMPORTED_MODULE_1__.default {
	constructor() {
		super();
		this.player = new _customElement_js__WEBPACK_IMPORTED_MODULE_0__.PlaneElement(150, 300, 50, 50);
		this.children = [this.player];
		this.status = "playing";
		this.monsterCD = 0;
	}
	start() {
		this.player.on("panstart", (event) => {
			const playerStartX = this.player.x;
			const playerStartY = this.player.y;

			const pan = (event) => {
				this.player.setPos(
					playerStartX + event.clientX - event.startX,
					playerStartY + event.clientY - event.startY
				);
			};

			const panend = (event) => {
				this.player.off("pan", pan);
				this.player.off("pan", panend);
			};

			this.player.on("pan", pan);
			this.player.on("panend", panend);
		});
	}
	update() {
		if (this.monsterCD === 0) {
			const randomX = Math.random() * window.screen.width;
			this.monsterCD = 50;
			this.createChildren(_customElement_js__WEBPACK_IMPORTED_MODULE_0__.MonsterElement, randomX, 0, 40, 40);
		} else {
			this.monsterCD--;
		}
	}
	updateFrame() {
		this.executeEvent();
		this.update();
		this.handleCollistion();
		(0,common_utils__WEBPACK_IMPORTED_MODULE_2__.bfs)(this.children, (eachNode) => {
			eachNode.updateFrame();
		});
		this.renderer.render(this.children);
	}
	run() {
		(0,core_runtime_js__WEBPACK_IMPORTED_MODULE_3__.runAnimation)(this.updateFrame.bind(this));
	}
}

const game = new PlaneGame();
game.start();
game.run();


/***/ }),

/***/ "./games/planeGame/src/image/egg.png":
/*!*******************************************!*\
  !*** ./games/planeGame/src/image/egg.png ***!
  \*******************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__.r, __webpack_require__.p, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "8c59f8d6fd756d4f8b944996d209b2b5.png");

/***/ }),

/***/ "./games/planeGame/src/image/fire.png":
/*!********************************************!*\
  !*** ./games/planeGame/src/image/fire.png ***!
  \********************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__.r, __webpack_require__.p, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "5674675a98ddeeda233918c11302782c.png");

/***/ }),

/***/ "./games/planeGame/src/image/monster.png":
/*!***********************************************!*\
  !*** ./games/planeGame/src/image/monster.png ***!
  \***********************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__.r, __webpack_require__.p, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "4fd04f5d83421ae220f7360348872e69.png");

/***/ }),

/***/ "./games/planeGame/src/image/plane.png":
/*!*********************************************!*\
  !*** ./games/planeGame/src/image/plane.png ***!
  \*********************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__.r, __webpack_require__.p, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "7e5988a6848dc938a850a97ecafc75f9.png");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./games/planeGame/src/index.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9nYW1lX2dlbmVyYXRvci8uL2NvbW1vbi91dGlscy5qcyIsIndlYnBhY2s6Ly9nYW1lX2dlbmVyYXRvci8uL2NvcmUvYmFzZUNvbXBvbmVudC5qcyIsIndlYnBhY2s6Ly9nYW1lX2dlbmVyYXRvci8uL2NvcmUvYmFzZUVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vZ2FtZV9nZW5lcmF0b3IvLi9jb3JlL2Jhc2VHYW1lLmpzIiwid2VicGFjazovL2dhbWVfZ2VuZXJhdG9yLy4vY29yZS9nZXN0dXJlLmpzIiwid2VicGFjazovL2dhbWVfZ2VuZXJhdG9yLy4vY29yZS9yZW5kZXJlci5qcyIsIndlYnBhY2s6Ly9nYW1lX2dlbmVyYXRvci8uL2NvcmUvcnVudGltZS5qcyIsIndlYnBhY2s6Ly9nYW1lX2dlbmVyYXRvci8uL2dhbWVzL3BsYW5lR2FtZS9zcmMvY3VzdG9tRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9nYW1lX2dlbmVyYXRvci8uL2dhbWVzL3BsYW5lR2FtZS9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vZ2FtZV9nZW5lcmF0b3IvLi9nYW1lcy9wbGFuZUdhbWUvc3JjL2ltYWdlL2VnZy5wbmciLCJ3ZWJwYWNrOi8vZ2FtZV9nZW5lcmF0b3IvLi9nYW1lcy9wbGFuZUdhbWUvc3JjL2ltYWdlL2ZpcmUucG5nIiwid2VicGFjazovL2dhbWVfZ2VuZXJhdG9yLy4vZ2FtZXMvcGxhbmVHYW1lL3NyYy9pbWFnZS9tb25zdGVyLnBuZyIsIndlYnBhY2s6Ly9nYW1lX2dlbmVyYXRvci8uL2dhbWVzL3BsYW5lR2FtZS9zcmMvaW1hZ2UvcGxhbmUucG5nIiwid2VicGFjazovL2dhbWVfZ2VuZXJhdG9yL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2dhbWVfZ2VuZXJhdG9yL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9nYW1lX2dlbmVyYXRvci93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL2dhbWVfZ2VuZXJhdG9yL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZ2FtZV9nZW5lcmF0b3Ivd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9nYW1lX2dlbmVyYXRvci93ZWJwYWNrL3J1bnRpbWUvcHVibGljUGF0aCIsIndlYnBhY2s6Ly9nYW1lX2dlbmVyYXRvci93ZWJwYWNrL3N0YXJ0dXAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDVGU7QUFDZjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLG1CQUFtQjtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM5RTJDOztBQUUzQywwQkFBMEIsbURBQWE7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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O1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7Ozs7V0NOQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxrQzs7OztVQ2ZBO1VBQ0E7VUFDQTtVQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gYmZzKG5vZGUsIGZ1bmMpe1xuICAgIGNvbnN0IHNlYXJjaCA9IEFycmF5LmlzQXJyYXkobm9kZSk/Wy4uLm5vZGVdOltub2RlXVxuICAgIHdoaWxlIChzZWFyY2gubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IGN1cnJOb2RlID0gc2VhcmNoLnNoaWZ0KClcbiAgICAgICAgZnVuYyhjdXJyTm9kZSk7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGN1cnJOb2RlLmNoaWxkcmVuKSkge1xuXHRcdFx0c2VhcmNoLnB1c2goLi4uY3Vyck5vZGUuY2hpbGRyZW4pO1xuXHRcdH1cbiAgICB9XG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZUNvbXBvbmVudCB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHRoaXMuYmVmb3JlQ3JlYXRlKCk7XG5cblx0XHR0aGlzLl9ldmVudFF1ZXVlID0gW107XG5cdFx0dGhpcy5fZXZlbnRMaXN0ZW5lcnMgPSBuZXcgTWFwKCk7XG5cdFx0dGhpcy5jaGlsZHJlbiA9IFtdO1xuXHRcdHRoaXMucGFyZW50ID0gbnVsbDtcblx0XHR0aGlzLm9uKFwiZGVzdHJveVwiLCAoZWxlbWVudCkgPT4ge1xuXHRcdFx0dGhpcy5jaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW4uZmlsdGVyKChlKSA9PiBlICE9PSBlbGVtZW50KTtcblx0XHR9KTtcblxuXHRcdHRoaXMuY3JlYXRlZCgpO1xuXHR9XG5cdC8qKlxuXHQgKiDnu4Tku7bpl7TkuqTmtYHmnLrliLZcblx0ICovXG5cdGhhc0V2ZW50TGlzdGVuZXIobmFtZSkge1xuXHRcdC8vIOafpeeci+acieaXoOS6i+S7tuebkeWQrFxuXHRcdHJldHVybiB0aGlzLl9ldmVudExpc3RlbmVycy5oYXMobmFtZSk7XG5cdH1cblx0b24obmFtZSwgaGFuZGxlcikge1xuXHRcdC8vIOa3u+WKoOS6i+S7tuebkeWQrO+8jOebkeWQrOadpeiHqkdhbWXmtL7lj5HnmoTkuovku7Zcblx0XHR0aGlzLl9ldmVudExpc3RlbmVycy5zZXQobmFtZSwgaGFuZGxlcik7XG5cdH1cblx0b2ZmKG5hbWUsIGhhbmRsZXIpIHtcblx0XHQvLyDnp7vpmaTkuovku7bnm5HlkKxcblx0XHR0aGlzLl9ldmVudExpc3RlbmVycy5kZWxldGUobmFtZSk7XG5cdH1cblx0dHJpZ2dlckV2ZW50KG5hbWUsIGRhdGEpIHtcblx0XHQvLyDmiorkuovku7bmt7vliqDliLDpmJ/liJfkuIosIOW+heS4i+S4gOW4p+aJp+ihjFxuXHRcdGlmICghdGhpcy5fZXZlbnRMaXN0ZW5lcnMuaGFzKG5hbWUpKSByZXR1cm47XG5cdFx0Y29uc3QgaGFuZGxlciA9IHRoaXMuX2V2ZW50TGlzdGVuZXJzLmdldChuYW1lKTtcblx0XHRoYW5kbGVyLmV2ZW50TmFtZSA9IG5hbWU7IC8vIOeUqOS6jumBv+WFjemHjeWkjeaJp+ihjOebuOWQjOeahOS6i+S7tlxuXHRcdHRoaXMuX2V2ZW50UXVldWUucHVzaChmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gaGFuZGxlcihkYXRhKTtcblx0XHR9KTtcblx0fVxuXHRzZW5kRXZlbnQodGFyZ2V0LCBldmVudE5hbWUsIGRhdGEpIHtcblx0XHQvLyDlj5HpgIHkuovku7bliLDlhbbku5bnu4Tku7bkuIrpnaJcblx0XHRpZiAodHlwZW9mIHRhcmdldC50cmlnZ2VyRXZlbnQgPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0dGFyZ2V0LnRyaWdnZXJFdmVudChldmVudE5hbWUsIGRhdGEpO1xuXHRcdH1cblx0fVxuXHRleGVjdXRlRXZlbnQoKSB7XG5cdFx0Ly8g5omn6KGM6Zif5YiX5LiK55qE5LqL5Lu2XG5cdFx0d2hpbGUgKHRoaXMuX2V2ZW50UXVldWUubGVuZ3RoKSB7XG5cdFx0XHRjb25zdCBoYW5kbGVyID0gdGhpcy5fZXZlbnRRdWV1ZS5zaGlmdCgpO1xuXHRcdFx0aWYgKHRoaXMuX2V2ZW50UXVldWUubGVuZ3RoICYmIHRoaXMuX2V2ZW50UXVldWVbMF0uZXZlbnROYW1lID09PSBoYW5kbGVyLmV2ZW50TmFtZSkgY29udGludWU7XG5cdFx0XHRoYW5kbGVyKCk7XG5cdFx0fVxuXHR9XG5cdC8qKlxuXHQgKiDliJvlu7rjgIHplIDmr4Hku6Xlj4rnlJ/lkb3lkajmnJ9cblx0ICovXG5cdGNyZWF0ZUNoaWxkcmVuKENvbnN0cnVjdG9yLCB4LCB5LCB3LCBoKSB7XG5cdFx0Ly8gZGVidWdnZXJcblx0XHRjb25zdCBjaGlsZCA9IG5ldyBDb25zdHJ1Y3Rvcih4LCB5LCB3LCBoKTtcblx0XHR0aGlzLmNoaWxkcmVuLnB1c2goY2hpbGQpO1xuXHRcdGNoaWxkLnNldFBhcmVudCh0aGlzKTtcblx0XHRyZXR1cm4gY2hpbGQ7XG5cdH1cblx0c2V0UGFyZW50KHBhcmVudCkge1xuXHRcdHRoaXMucGFyZW50ID0gcGFyZW50O1xuXHR9XG5cdGRlc3Ryb3koKSB7XG5cdFx0dGhpcy5iZWZvcmVEZXN0cm95KCk7XG5cblx0XHR0aGlzLnNlbmRFdmVudCh0aGlzLnBhcmVudCwgXCJkZXN0cm95XCIsIHRoaXMpO1xuXG5cdFx0dGhpcy5kZXN0cm95ZWQoe30pO1xuXHR9XG5cdGJlZm9yZUNyZWF0ZSgpIHt9XG5cdGNyZWF0ZWQoKSB7fVxuXHRiZWZvcmVVcGRhdGUoKSB7fVxuXHR1cGRhdGVkKCkge31cblx0YmVmb3JlRGVzdHJveSgpIHt9XG5cdGRlc3Ryb3llZCgpIHt9XG59IiwiaW1wb3J0IGJhc2VDb21wb25lbnQgZnJvbSBcIi4vYmFzZUNvbXBvbmVudFwiXG5cbmNsYXNzIEJhc2VFbGVtZW50IGV4dGVuZHMgYmFzZUNvbXBvbmVudCB7XG5cdGNvbnN0cnVjdG9yKHggPSAwLCB5ID0gMCwgd2lkdGggPSAwLCBoZWlnaHQgPSAwKSB7XG5cdFx0c3VwZXIoKTtcblx0XHR0aGlzLnggPSB4O1xuXHRcdHRoaXMueSA9IHk7XG5cdFx0dGhpcy53aWR0aCA9IHdpZHRoO1xuXHRcdHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuXHRcdHRoaXMuY29sbGlzaW9uTGlzdGVuZXIgPSBuZXcgTWFwKCk7XG5cdFx0dGhpcy5jb2xsaXN0aW9uSGFuZGxlUXVldWUgPSBbXVxuXHR9XG5cdHVwZGF0ZSgpIHtcblx0XHQvLyDoh6rlrprkuYnmr4/kuIDluKfmm7TmlrDnmoTpgLvovpFcblx0fVxuXHR1cGRhdGVGcmFtZSgpIHtcblx0XHR0aGlzLmV4ZWN1dGVFdmVudCgpO1xuXHRcdHRoaXMudXBkYXRlKCk7XG5cdH1cblx0cmVuZGVyKGN0eCkge1xuXHRcdC8vIOWmguaenOacieiHquW3seeahOa4suafk+mAu+i+keeahOivneWPr+S7peimhuebllxuXHRcdGN0eC5kcmF3SW1hZ2UodGhpcy5pbWFnZSwgdGhpcy54LCB0aGlzLnksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcblx0fVxuXHRzZXRQb3MoeCwgeSkge1xuXHRcdHRoaXMueCA9IHg7XG5cdFx0dGhpcy55ID0geTtcblx0fVxuXHQvKipcblx0ICog56Kw5pKe566h55CGXG5cdCAqL1xuXHRzZXRDb2xsaXN0aW9uTGlzdGVuZXIoZWxlbWVudFR5cGUsIGhhbmRsZXIpIHtcblx0XHR0aGlzLmNvbGxpc2lvbkxpc3RlbmVyLnNldChlbGVtZW50VHlwZSwgKCk9Pntcblx0XHRcdHRoaXMuY29sbGlzdGlvbkhhbmRsZVF1ZXVlLnB1c2goKC4uLmFyZ3MpPT57XG5cdFx0XHRcdHJldHVybiBoYW5kbGVyLmNhbGwodGhpcywgLi4uYXJncylcblx0XHRcdH0pXG5cdFx0fSk7XG5cdH1cblx0ZXhlY3V0ZUNvbGxpc3Rpb25RdWV1ZSgpe1xuXHRcdHdoaWxlKHRoaXMuY29sbGlzdGlvbkhhbmRsZVF1ZXVlLmxlbmd0aCl7XG5cdFx0XHRjb25zdCBoYW5kbGVyID0gdGhpcy5jb2xsaXN0aW9uSGFuZGxlUXVldWUuc2hpZnQoKTtcblx0XHRcdGhhbmRsZXIoKVxuXHRcdH1cblx0fVxufVxuXG4vLyDliJ3lp4vljJZjb25maWdcbi8vIOWxnuaAp1xuLy8g5pa55rOVIOeUn+aIkO+8iOmdmeaAgeaWueazle+8ieOAgVxuLy8g5LqL5Lu2XG4vLyDnlJ/lkb3lkajmnJ8gY3JlYXRlZOOAgXVwZGF0ZWTjgIFkZXN0cm95ZWRcblxuZXhwb3J0IGRlZmF1bHQgQmFzZUVsZW1lbnQiLCJpbXBvcnQgYmFzZUNvbXBvbmVudCBmcm9tIFwiLi9iYXNlQ29tcG9uZW50XCI7XG5pbXBvcnQgZW5hYmxlR2VzdHVyZSBmcm9tIFwiLi9nZXN0dXJlLmpzXCJcbmltcG9ydCB7IGJmcyB9IGZyb20gXCJjb21tb24vdXRpbHNcIjtcbmltcG9ydCBSZW5kZXJlciBmcm9tIFwiLi9yZW5kZXJlci5qc1wiO1xuXG5cbmNsYXNzIEdhbWUgZXh0ZW5kcyBiYXNlQ29tcG9uZW50IHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKTtcblx0XHR0aGlzLl9jcmVhdGVDYW52YXMoKVxuXHRcdHRoaXMuX2hhbmRsZVBhZ2VFdmVudCgpO1xuXHR9XG5cdF9jcmVhdGVDYW52YXMoKXtcblx0XHRjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKVxuXHRcdGNhbnZhcy53aWR0aCA9IHdpbmRvdy5zY3JlZW4ud2lkdGg7XG5cdFx0Y2FudmFzLmhlaWdodCA9IHdpbmRvdy5zY3JlZW4uaGVpZ2h0O1xuXHRcdHRoaXMuY2FudmFzID0gY2FudmFzXG5cdFx0ZW5hYmxlR2VzdHVyZShjYW52YXMpO1xuXHRcdHRoaXMucmVuZGVyZXIgPSBuZXcgUmVuZGVyZXIoY2FudmFzKTtcblx0XHRkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gXCJoaWRkZW5cIjtcblx0XHRkb2N1bWVudC5ib2R5LnN0eWxlLm1hcmdpbiA9IDA7XG5cdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjYW52YXMpXG5cdH1cblx0X2hhbmRsZVBhZ2VFdmVudCgpIHtcblx0XHQvLyDmj5DkvpvnrqHnkIbkuovku7bog73liptcblx0XHR0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwicGFuc3RhcnRcIiwgKGV2ZW50KSA9PiB7XG5cdFx0XHRjb25zdCBwYW4gPSAoZXZlbnQpID0+IHtcblx0XHRcdFx0ZGlzcGF0Y2hUb0FjdG9ycyhcInBhblwiLCBldmVudCwgZmFsc2UpO1xuXHRcdFx0fTtcblxuXHRcdFx0Y29uc3QgcGFuZW5kID0gKGV2ZW50KSA9PiB7XG5cdFx0XHRcdGRpc3BhdGNoVG9BY3RvcnMoXCJwYW5lbmRcIiwgZXZlbnQsIGZhbHNlKTtcblx0XHRcdFx0dGhpcy5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInBhblwiLCBwYW4pO1xuXHRcdFx0XHR0aGlzLmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKFwicGFuZW5kXCIsIHBhbmVuZCk7XG5cdFx0XHR9O1xuXG5cdFx0XHRjb25zdCBkaXNwYXRjaFRvQWN0b3JzID0gKGV2ZW50TmFtZSwgZXZlbnQsIHRhcmdldE9uRWxlbWVudCkgPT4ge1xuXHRcdFx0XHRjb25zdCBjaGlsZCA9IHRoaXMuY2hpbGRyZW4uZmlsdGVyKChjaGlsZCkgPT4gY2hpbGQuaGFzRXZlbnRMaXN0ZW5lcihldmVudE5hbWUpKTtcblxuXHRcdFx0XHRjb25zdCB7IGNsaWVudFgsIGNsaWVudFkgfSA9IGV2ZW50LmRldGFpbDtcblx0XHRcdFx0Zm9yIChsZXQgYWN0b3Igb2YgdGhpcy5jaGlsZHJlbikge1xuXHRcdFx0XHRcdGNvbnN0IHsgeCwgeSwgd2lkdGgsIGhlaWdodCB9ID0gYWN0b3I7XG5cdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0IXRhcmdldE9uRWxlbWVudCB8fFxuXHRcdFx0XHRcdFx0KGNsaWVudFggPiB4ICYmIGNsaWVudFkgPiB5ICYmIGNsaWVudFggPCB4ICsgd2lkdGggJiYgY2xpZW50WSA8IHkgKyBoZWlnaHQpXG5cdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHR0aGlzLnNlbmRFdmVudChhY3RvciwgZXZlbnROYW1lLCBldmVudC5kZXRhaWwpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0ZGlzcGF0Y2hUb0FjdG9ycyhcInBhbnN0YXJ0XCIsIGV2ZW50LCB0cnVlKTtcblxuXHRcdFx0dGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcInBhblwiLCBwYW4pO1xuXG5cdFx0XHR0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwicGFuZW5kXCIsIHBhbmVuZCk7XG5cdFx0fSk7XG5cdH1cblx0LyoqXG5cdCAqIOWkhOeQhueisOaSnlxuXHQgKi9cblx0aGFuZGxlQ29sbGlzdGlvbigpIHtcblx0XHRiZnModGhpcy5jaGlsZHJlbiwgKGNoaWxkKSA9PiB7XG5cdFx0XHRpZiAoY2hpbGQuY29sbGlzaW9uTGlzdGVuZXIuc2l6ZSkge1xuXHRcdFx0XHRiZnModGhpcy5jaGlsZHJlbiwgKG90aGVyQ2hpbGQpID0+IHtcblx0XHRcdFx0XHRpZiAoY2hpbGQuY29sbGlzaW9uTGlzdGVuZXIuaGFzKG90aGVyQ2hpbGQudHlwZSkgJiYgdGVzdENvbGxpc3Rpb24oY2hpbGQsIG90aGVyQ2hpbGQpKSB7XG5cdFx0XHRcdFx0XHRjb25zdCBoYW5kbGVyID0gY2hpbGQuY29sbGlzaW9uTGlzdGVuZXIuZ2V0KG90aGVyQ2hpbGQudHlwZSk7XG5cdFx0XHRcdFx0XHRoYW5kbGVyKG90aGVyQ2hpbGQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRiZnModGhpcy5jaGlsZHJlbiwgKGNoaWxkKT0+e1xuXHRcdFx0Y2hpbGQuZXhlY3V0ZUNvbGxpc3Rpb25RdWV1ZSgpO1xuXHRcdH0pXG5cblx0XHRmdW5jdGlvbiB0ZXN0Q29sbGlzdGlvbihlbGVtZW50QSwgZWxlbWVudEIpIHtcblx0XHRcdGxldCB7IHg6IHgxLCB5OiB5MSwgd2lkdGg6IHdpZHRoMSwgaGVpZ2h0OiBoZWlnaHQxIH0gPSBlbGVtZW50QTtcblx0XHRcdGxldCB7IHg6IHgyLCB5OiB5Miwgd2lkdGg6IHdpZHRoMiwgaGVpZ2h0OiBoZWlnaHQyIH0gPSBlbGVtZW50Qjtcblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdCh4MSA8PSB4MiAmJiB4MSArIHdpZHRoMSA+PSB4MiAmJiB5MSA8PSB5MiAmJiB5MSArIGhlaWdodDEgPj0geTIpIHx8XG5cdFx0XHRcdCh4MSA8PSB4MiArIHdpZHRoMiAmJiB4MSArIHdpZHRoMSA+PSB4MiArIHdpZHRoMiAmJiB5MSA8PSB5MiAmJiB5MSArIGhlaWdodDEgPj0geTIpIHx8XG5cdFx0XHRcdCh4MSA8PSB4MiAmJiB4MSArIHdpZHRoMSA+PSB4MiAmJiB5MSA8PSB5MiArIGhlaWdodDIgJiYgeTEgKyBoZWlnaHQxID49IHkyICsgaGVpZ2h0MikgfHxcblx0XHRcdFx0KHgxIDw9IHgyICsgd2lkdGgyICYmIHgxICsgd2lkdGgxID49IHgyICsgd2lkdGgyICYmIHkxIDw9IHkyICsgaGVpZ2h0MiAmJiB5MSArIGhlaWdodDEgPj0geTIgKyBoZWlnaHQyKVxuXHRcdFx0KTtcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZTtcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGVuYWJsZUdlc3R1cmUoZSkge1xuXHRsZXQgY29udGV4dCA9IHt9O1xuXG5cdGUuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgKGV2ZW50KSA9PiB7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNobW92ZVwiLCBtb3ZlKTtcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIGVuZCk7XG5cblx0XHRjb250ZXh0ID0ge307XG5cblx0XHRpZiAoZXZlbnQuY2hhbmdlZFRvdWNoZXMubGVuZ3RoID4gMSkgcmV0dXJuO1xuXG5cdFx0T2JqZWN0LmFzc2lnbihjb250ZXh0LCB7XG5cdFx0XHRzdGFydFg6IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFgsXG5cdFx0XHRzdGFydFk6IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFksXG5cdFx0XHRpc1RhcDogdHJ1ZSxcblx0XHRcdHRpbWVvdXRIYW5kbGVyOiBzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0aWYgKGNvbnRleHQuaXNUYXAgJiYgIWNvbnRleHQuaXNQYW4pIHtcblx0XHRcdFx0XHRjb250ZXh0LmlzVGFwID0gZmFsc2U7XG5cdFx0XHRcdFx0Y29udGV4dC5pc1ByZXNzID0gdHJ1ZTtcblx0XHRcdFx0XHRuZXdFdmVudERpc3BhdGNoKFwicHJlc3NzdGFydFwiLCB7XG5cdFx0XHRcdFx0XHRzdGFydFg6IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFgsXG5cdFx0XHRcdFx0XHRzdGFydFk6IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFksXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH0sIDUwMCksXG5cdFx0fSk7XG5cdH0pO1xuXG5cdGNvbnN0IG1vdmUgPSB0aHJvdHRsZSgoZXZlbnQpID0+IHtcblx0XHRpZiAoZXZlbnQuY2hhbmdlZFRvdWNoZXMubGVuZ3RoID4gMSkge1xuXHRcdFx0Y29uc29sZS5sb2coXCJyZXNpemVcIik7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgeyBjbGllbnRYLCBjbGllbnRZIH0gPSBldmVudC5jaGFuZ2VkVG91Y2hlc1swXTtcblxuXHRcdGlmICgoY2xpZW50WCAtIGNvbnRleHQuc3RhcnRYKSAqKiAyICsgKGNsaWVudFkgLSBjb250ZXh0LnN0YXJ0WSkgKiogMiA+IDEwMCkge1xuXHRcdFx0aWYgKGNvbnRleHQuaXNQYW4pIHtcblx0XHRcdFx0bmV3RXZlbnREaXNwYXRjaChcInBhblwiLCB7XG5cdFx0XHRcdFx0c3RhcnRYOiBjb250ZXh0LnN0YXJ0WCxcblx0XHRcdFx0XHRzdGFydFk6IGNvbnRleHQuc3RhcnRZLFxuXHRcdFx0XHRcdGNsaWVudFgsXG5cdFx0XHRcdFx0Y2xpZW50WSxcblx0XHRcdFx0fSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb250ZXh0LmlzUGFuID0gdHJ1ZTtcblx0XHRcdFx0bmV3RXZlbnREaXNwYXRjaChcInBhbnN0YXJ0XCIsIHtcblx0XHRcdFx0XHRjbGllbnRYOiBjb250ZXh0LnN0YXJ0WCxcblx0XHRcdFx0XHRjbGllbnRZOiBjb250ZXh0LnN0YXJ0WSxcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LCAxNik7XG5cblx0Y29uc3QgZW5kID0gKGV2ZW50KSA9PiB7XG5cdFx0aWYgKGNvbnRleHQuaXNSZXNpemUpIGNvbnNvbGUubG9nKFwicmVzaXplZW5kXCIpO1xuXG5cdFx0Y29uc3QgeyBjbGllbnRYLCBjbGllbnRZIH0gPSBldmVudC5jaGFuZ2VkVG91Y2hlc1swXTtcblxuXHRcdGlmIChjb250ZXh0LmlzVGFwKVxuXHRcdFx0bmV3RXZlbnREaXNwYXRjaChcInRhcFwiLCB7XG5cdFx0XHRcdHN0YXJ0WDogY29udGV4dC5zdGFydFgsXG5cdFx0XHRcdHN0YXJ0WTogY29udGV4dC5zdGFydFksXG5cdFx0XHR9KTtcblx0XHRpZiAoY29udGV4dC5pc1Bhbilcblx0XHRcdG5ld0V2ZW50RGlzcGF0Y2goXCJwYW5lbmRcIiwge1xuXHRcdFx0XHRzdGFydFg6IGNvbnRleHQuc3RhcnRYLFxuXHRcdFx0XHRzdGFydFk6IGNvbnRleHQuc3RhcnRZLFxuXHRcdFx0XHRjbGllbnRYLFxuXHRcdFx0XHRjbGllbnRZLFxuXHRcdFx0fSk7XG5cdFx0aWYgKGNvbnRleHQuaXNQcmVzcykgbmV3RXZlbnREaXNwYXRjaChcInByZXNzZW5kXCIpO1xuXG5cdFx0Y2xlYXJUaW1lb3V0KGNvbnRleHQudGltZW91dEhhbmRsZXIpO1xuXHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2htb3ZlXCIsIG1vdmUpO1xuXHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgZW5kKTtcblx0fTtcblxuXHRmdW5jdGlvbiBuZXdFdmVudERpc3BhdGNoKG5hbWUsIGNvbmZpZykge1xuXHRcdGNvbnN0IGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoXCJDdXN0b21FdmVudFwiKTtcblx0XHRldmVudC5pbml0Q3VzdG9tRXZlbnQobmFtZSwgZmFsc2UsIGZhbHNlLCBjb25maWcpO1xuXHRcdGUuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gdGhyb3R0bGUoZnVuYywgZHVyYXRpb24pIHtcblx0bGV0IGVuYWJsZSA9IHRydWU7XG5cdHJldHVybiBmdW5jdGlvbiAoLi4uYXJncykge1xuXHRcdGlmIChlbmFibGUpIHtcblx0XHRcdGVuYWJsZSA9IGZhbHNlO1xuXHRcdFx0ZnVuYy5hcHBseSh0aGlzLCBhcmdzKTtcblx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRlbmFibGUgPSB0cnVlO1xuXHRcdFx0fSwgZHVyYXRpb24pO1xuXHRcdH1cblx0fTtcbn1cbiIsImltcG9ydCB7IGJmcyB9IGZyb20gXCJjb21tb24vdXRpbHNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVuZGVyZXIge1xuXHRjb25zdHJ1Y3RvcihjYW52YXMpIHtcblx0XHR0aGlzLmNhbnZhcyA9IGNhbnZhcztcblx0XHR0aGlzLmN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG5cdH1cblx0Y2xlYXIoKSB7XG5cdFx0dGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xuXHR9XG5cdHJlbmRlcihhY3RvcnMpIHtcblx0XHR0aGlzLmNsZWFyKCk7XG5cdFx0YmZzKGFjdG9ycywgKGVhY2hOb2RlKSA9PiB7XG5cdFx0XHQvLyBkZWJ1Z2dlclxuXHRcdFx0ZWFjaE5vZGUucmVuZGVyKHRoaXMuY3R4KTtcblx0XHR9KTtcblx0fVxufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIHJ1bkFuaW1hdGlvbihmcmFtZUZ1bmMpIHtcblx0bGV0IGxhc3RUaW1lID0gbnVsbDtcblx0ZnVuY3Rpb24gZnJhbWUodGltZSkge1xuXHRcdGlmIChsYXN0VGltZSAhPSBudWxsKSB7XG5cdFx0XHRsZXQgdGltZVN0ZXAgPSBNYXRoLm1pbih0aW1lIC0gbGFzdFRpbWUsIDEwMCkgLyAxMDAwO1xuXHRcdFx0aWYgKGZyYW1lRnVuYyh0aW1lU3RlcCkgPT09IGZhbHNlKSByZXR1cm47XG5cdFx0fVxuXHRcdGxhc3RUaW1lID0gdGltZTtcblx0XHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnJhbWUpO1xuXHR9XG5cdHJlcXVlc3RBbmltYXRpb25GcmFtZShmcmFtZSk7XG59XG4iLCJpbXBvcnQgZWdnIGZyb20gXCIuL2ltYWdlL2VnZy5wbmdcIjtcbmltcG9ydCBwbGFuZSBmcm9tIFwiLi9pbWFnZS9wbGFuZS5wbmdcIjtcbmltcG9ydCBmaXJlIGZyb20gXCIuL2ltYWdlL2ZpcmUucG5nXCI7XG5pbXBvcnQgbW9uc3RlciBmcm9tIFwiLi9pbWFnZS9tb25zdGVyLnBuZ1wiO1xuaW1wb3J0IEJhc2VFbGVtZW50IGZyb20gXCJjb3JlL2Jhc2VFbGVtZW50LmpzXCI7XG5cbmNsYXNzIEVnZ0VsZW1lbnQgZXh0ZW5kcyBCYXNlRWxlbWVudCB7XG5cdGNvbnN0cnVjdG9yKHgsIHksIHcsIGgpIHtcblx0XHRzdXBlcih4LCB5LCB3LCBoKTtcblx0XHR0aGlzLmltYWdlID0gbmV3IEltYWdlKCk7XG5cdFx0dGhpcy5pbWFnZS5zcmMgPSBlZ2c7XG5cdFx0dGhpcy5zZXRDb2xsaXN0aW9uTGlzdGVuZXIoXCJtb25zdGVyXCIsICgpID0+IHRoaXMuZGVzdHJveSgpKTtcblx0fVxuXHR1cGRhdGUoKSB7XG5cdFx0dGhpcy55IC09IDMwO1xuXHRcdGlmICh0aGlzLnkgPCAwKSB0aGlzLmRlc3Ryb3koKTtcblx0fVxuXHRnZXQgdHlwZSgpIHtcblx0XHRyZXR1cm4gXCJlZ2dcIjtcblx0fVxufVxuXG5jbGFzcyBNb25zdGVyRWxlbWVudCBleHRlbmRzIEJhc2VFbGVtZW50IHtcblx0Y29uc3RydWN0b3IoeCwgeSwgdywgaCkge1xuXHRcdHN1cGVyKHgsIHksIHcsIGgpO1xuXHRcdHRoaXMuaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcblx0XHR0aGlzLmltYWdlLnNyYyA9IG1vbnN0ZXI7XG5cdFx0dGhpcy5zZXRDb2xsaXN0aW9uTGlzdGVuZXIoXCJlZ2dcIiwgKCkgPT4gdGhpcy5kZXN0cm95KCkpO1xuICAgICAgICB0aGlzLnNldENvbGxpc3Rpb25MaXN0ZW5lcihcInBsYW5lXCIsICgpID0+IHRoaXMuZGVzdHJveSgpKTtcblx0fVxuXHR1cGRhdGUoKSB7XG5cdFx0dGhpcy55ICs9IDU7XG5cdFx0aWYgKHRoaXMueSA+PSB3aW5kb3cuc2NyZWVuLmhlaWdodCkgdGhpcy5kZXN0cm95KCk7XG5cdH1cblx0Z2V0IHR5cGUoKSB7XG5cdFx0cmV0dXJuIFwibW9uc3RlclwiO1xuXHR9XG59XG5cbmNsYXNzIFBsYW5lRWxlbWVudCBleHRlbmRzIEJhc2VFbGVtZW50IHtcblx0Y29uc3RydWN0b3IoeCwgeSwgdywgaCkge1xuXHRcdHN1cGVyKHgsIHksIHcsIGgpO1xuXHRcdHRoaXMuaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcblx0XHR0aGlzLmltYWdlLnNyYyA9IHBsYW5lO1xuXHRcdHRoaXMuZmlyZUNEID0gMDtcblx0XHR0aGlzLnNldENvbGxpc3Rpb25MaXN0ZW5lcihcIm1vbnN0ZXJcIiwgKCkgPT4gYWxlcnQoJ3lvdSBsb3NlJykpO1xuXG5cdH1cblx0dXBkYXRlKCkge1xuXHRcdGlmICh0aGlzLmZpcmVDRCA9PT0gMCkge1xuXHRcdFx0dGhpcy5jcmVhdGVDaGlsZHJlbihFZ2dFbGVtZW50LCB0aGlzLngsIHRoaXMueSwgNTAsIDcwKTtcblx0XHRcdHRoaXMuZmlyZUNEID0gMTA7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuZmlyZUNELS07XG5cdFx0fVxuXHR9XG5cdGdldCB0eXBlKCkge1xuXHRcdHJldHVybiBcInBsYW5lXCI7XG5cdH1cbn1cblxuZXhwb3J0IHsgRWdnRWxlbWVudCwgUGxhbmVFbGVtZW50LCBNb25zdGVyRWxlbWVudCB9O1xuIiwiaW1wb3J0IHsgRWdnRWxlbWVudCwgUGxhbmVFbGVtZW50LCBNb25zdGVyRWxlbWVudCB9IGZyb20gXCIuL2N1c3RvbUVsZW1lbnQuanNcIjtcbmltcG9ydCB7IHJ1bkFuaW1hdGlvbiB9IGZyb20gXCJjb3JlL3J1bnRpbWUuanNcIjtcbmltcG9ydCBHYW1lIGZyb20gXCJjb3JlL2Jhc2VHYW1lLmpzXCI7XG5pbXBvcnQgeyBiZnMgfSBmcm9tIFwiY29tbW9uL3V0aWxzXCI7XG5cbmNsYXNzIFBsYW5lR2FtZSBleHRlbmRzIEdhbWUge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMucGxheWVyID0gbmV3IFBsYW5lRWxlbWVudCgxNTAsIDMwMCwgNTAsIDUwKTtcblx0XHR0aGlzLmNoaWxkcmVuID0gW3RoaXMucGxheWVyXTtcblx0XHR0aGlzLnN0YXR1cyA9IFwicGxheWluZ1wiO1xuXHRcdHRoaXMubW9uc3RlckNEID0gMDtcblx0fVxuXHRzdGFydCgpIHtcblx0XHR0aGlzLnBsYXllci5vbihcInBhbnN0YXJ0XCIsIChldmVudCkgPT4ge1xuXHRcdFx0Y29uc3QgcGxheWVyU3RhcnRYID0gdGhpcy5wbGF5ZXIueDtcblx0XHRcdGNvbnN0IHBsYXllclN0YXJ0WSA9IHRoaXMucGxheWVyLnk7XG5cblx0XHRcdGNvbnN0IHBhbiA9IChldmVudCkgPT4ge1xuXHRcdFx0XHR0aGlzLnBsYXllci5zZXRQb3MoXG5cdFx0XHRcdFx0cGxheWVyU3RhcnRYICsgZXZlbnQuY2xpZW50WCAtIGV2ZW50LnN0YXJ0WCxcblx0XHRcdFx0XHRwbGF5ZXJTdGFydFkgKyBldmVudC5jbGllbnRZIC0gZXZlbnQuc3RhcnRZXG5cdFx0XHRcdCk7XG5cdFx0XHR9O1xuXG5cdFx0XHRjb25zdCBwYW5lbmQgPSAoZXZlbnQpID0+IHtcblx0XHRcdFx0dGhpcy5wbGF5ZXIub2ZmKFwicGFuXCIsIHBhbik7XG5cdFx0XHRcdHRoaXMucGxheWVyLm9mZihcInBhblwiLCBwYW5lbmQpO1xuXHRcdFx0fTtcblxuXHRcdFx0dGhpcy5wbGF5ZXIub24oXCJwYW5cIiwgcGFuKTtcblx0XHRcdHRoaXMucGxheWVyLm9uKFwicGFuZW5kXCIsIHBhbmVuZCk7XG5cdFx0fSk7XG5cdH1cblx0dXBkYXRlKCkge1xuXHRcdGlmICh0aGlzLm1vbnN0ZXJDRCA9PT0gMCkge1xuXHRcdFx0Y29uc3QgcmFuZG9tWCA9IE1hdGgucmFuZG9tKCkgKiB3aW5kb3cuc2NyZWVuLndpZHRoO1xuXHRcdFx0dGhpcy5tb25zdGVyQ0QgPSA1MDtcblx0XHRcdHRoaXMuY3JlYXRlQ2hpbGRyZW4oTW9uc3RlckVsZW1lbnQsIHJhbmRvbVgsIDAsIDQwLCA0MCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMubW9uc3RlckNELS07XG5cdFx0fVxuXHR9XG5cdHVwZGF0ZUZyYW1lKCkge1xuXHRcdHRoaXMuZXhlY3V0ZUV2ZW50KCk7XG5cdFx0dGhpcy51cGRhdGUoKTtcblx0XHR0aGlzLmhhbmRsZUNvbGxpc3Rpb24oKTtcblx0XHRiZnModGhpcy5jaGlsZHJlbiwgKGVhY2hOb2RlKSA9PiB7XG5cdFx0XHRlYWNoTm9kZS51cGRhdGVGcmFtZSgpO1xuXHRcdH0pO1xuXHRcdHRoaXMucmVuZGVyZXIucmVuZGVyKHRoaXMuY2hpbGRyZW4pO1xuXHR9XG5cdHJ1bigpIHtcblx0XHRydW5BbmltYXRpb24odGhpcy51cGRhdGVGcmFtZS5iaW5kKHRoaXMpKTtcblx0fVxufVxuXG5jb25zdCBnYW1lID0gbmV3IFBsYW5lR2FtZSgpO1xuZ2FtZS5zdGFydCgpO1xuZ2FtZS5ydW4oKTtcbiIsImV4cG9ydCBkZWZhdWx0IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCI4YzU5ZjhkNmZkNzU2ZDRmOGI5NDQ5OTZkMjA5YjJiNS5wbmdcIjsiLCJleHBvcnQgZGVmYXVsdCBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiNTY3NDY3NWE5OGRkZWVkYTIzMzkxOGMxMTMwMjc4MmMucG5nXCI7IiwiZXhwb3J0IGRlZmF1bHQgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcIjRmZDA0ZjVkODM0MjFhZTIyMGY3MzYwMzQ4ODcyZTY5LnBuZ1wiOyIsImV4cG9ydCBkZWZhdWx0IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCI3ZTU5ODhhNjg0OGRjOTM4YTg1MGE5N2VjYWZjNzVmOS5wbmdcIjsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRpZihfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0uZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJ2YXIgc2NyaXB0VXJsO1xuaWYgKF9fd2VicGFja19yZXF1aXJlX18uZy5pbXBvcnRTY3JpcHRzKSBzY3JpcHRVcmwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcubG9jYXRpb24gKyBcIlwiO1xudmFyIGRvY3VtZW50ID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmRvY3VtZW50O1xuaWYgKCFzY3JpcHRVcmwgJiYgZG9jdW1lbnQpIHtcblx0aWYgKGRvY3VtZW50LmN1cnJlbnRTY3JpcHQpXG5cdFx0c2NyaXB0VXJsID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdC5zcmNcblx0aWYgKCFzY3JpcHRVcmwpIHtcblx0XHR2YXIgc2NyaXB0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0XCIpO1xuXHRcdGlmKHNjcmlwdHMubGVuZ3RoKSBzY3JpcHRVcmwgPSBzY3JpcHRzW3NjcmlwdHMubGVuZ3RoIC0gMV0uc3JjXG5cdH1cbn1cbi8vIFdoZW4gc3VwcG9ydGluZyBicm93c2VycyB3aGVyZSBhbiBhdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIHlvdSBtdXN0IHNwZWNpZnkgYW4gb3V0cHV0LnB1YmxpY1BhdGggbWFudWFsbHkgdmlhIGNvbmZpZ3VyYXRpb25cbi8vIG9yIHBhc3MgYW4gZW1wdHkgc3RyaW5nIChcIlwiKSBhbmQgc2V0IHRoZSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyB2YXJpYWJsZSBmcm9tIHlvdXIgY29kZSB0byB1c2UgeW91ciBvd24gbG9naWMuXG5pZiAoIXNjcmlwdFVybCkgdGhyb3cgbmV3IEVycm9yKFwiQXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXJcIik7XG5zY3JpcHRVcmwgPSBzY3JpcHRVcmwucmVwbGFjZSgvIy4qJC8sIFwiXCIpLnJlcGxhY2UoL1xcPy4qJC8sIFwiXCIpLnJlcGxhY2UoL1xcL1teXFwvXSskLywgXCIvXCIpO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5wID0gc2NyaXB0VXJsOyIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlXG5fX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9nYW1lcy9wbGFuZUdhbWUvc3JjL2luZGV4LmpzXCIpO1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgdXNlZCAnZXhwb3J0cycgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxuIl0sInNvdXJjZVJvb3QiOiIifQ==