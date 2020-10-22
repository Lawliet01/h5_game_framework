import baseComponent from "./baseComponent";

class Game extends baseComponent{
	constructor(canvas) {
		super()
		this.canvas = canvas;
		this._handlePageEvent();
		
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
}

export default Game;