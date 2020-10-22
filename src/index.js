import enableGesture from "./lib/gesture.js";
import { EggElement, PlaneElement, MonsterElement } from "./customElement.js";
import Renderer from "./common/renderer.js";
import { runAnimation } from "./common/runtime.js";
import Game from "./common/baseGame.js";
import { bfs } from "./lib/utils";

const canvas = document.getElementById("app");
canvas.width = window.screen.width;
canvas.height = window.screen.height;
enableGesture(canvas);

const renderer = new Renderer(canvas);

class PlaneGame extends Game {
	constructor(canvas) {
		super(canvas);
		this.player = new PlaneElement(150, 300, 50, 50);
		this.children = [this.player];
		this.status = "playing";
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
		const monsterCD = 0;
		const monsterGenerator = () => {
			if (monsterCD === 0) {
				const randomX = Math.random() * window.screen.width;
				return this.createChildren(MonsterElement);
			} else {
				monsterCD = 1000
			}
		};
	}
	updateFrame() {
		this.update();
		bfs(this.children, (eachNode) => {
			eachNode.updateFrame();
		});
		renderer.render(this.children);
	}
	run() {
		runAnimation(this.updateFrame.bind(this));
	}
}

const game = new PlaneGame(canvas);
game.start();
game.run();
