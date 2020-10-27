import baseComponent from "./baseComponent";
import enableGesture from "./gesture.js"
import { bfs } from "common/utils";
import Renderer from "./renderer.js";


class Game extends baseComponent {
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
		enableGesture(canvas);
		this.renderer = new Renderer(canvas);
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
		bfs(this.children, (child) => {
			if (child.collisionListener.size) {
				bfs(this.children, (otherChild) => {
					if (child.collisionListener.has(otherChild.type) && testCollistion(child, otherChild)) {
						const handler = child.collisionListener.get(otherChild.type);
						handler(otherChild);
					}
				});
			}
		});

		bfs(this.children, (child)=>{
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

export default Game;
