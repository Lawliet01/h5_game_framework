import { bfs } from "../lib/utils";

export default class Rendererer {
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
