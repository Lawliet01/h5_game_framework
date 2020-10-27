import { EggElement, PlaneElement, MonsterElement } from "./customElement.js";
import { runAnimation } from "core/runtime.js";
import Game from "core/baseGame.js";
import { bfs } from "common/utils";

class PlaneGame extends Game {
	constructor() {
		super();
		this.player = new PlaneElement(150, 300, 50, 50);
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
			this.createChildren(MonsterElement, randomX, 0, 40, 40);
		} else {
			this.monsterCD--;
		}
	}
	updateFrame() {
		this.executeEvent();
		this.update();
		this.handleCollistion();
		bfs(this.children, (eachNode) => {
			eachNode.updateFrame();
		});
		this.renderer.render(this.children);
	}
	run() {
		runAnimation(this.updateFrame.bind(this));
	}
}

const game = new PlaneGame();
game.start();
game.run();
