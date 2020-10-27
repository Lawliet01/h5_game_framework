import { bfs } from "common/utils";

export default class Renderer {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
	}
	clear() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
	render(actors) {
		this.clear();
		bfs(actors, (eachNode) => {
			// debugger
			eachNode.render(this.ctx);
		});
	}
}
