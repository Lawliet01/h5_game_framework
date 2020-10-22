import egg from "./image/egg.png";
import plane from "./image/plane.png"
import fire from "./image/fire.png"
import BaseElement from "./common/baseElement.js"
import monster from "./image/monster.png"

class EggElement extends BaseElement {
	constructor(x, y, w, h) {
		super(x, y, w, h);
		this.image = new Image();
		this.image.src = egg;
	}
	update() {
		this.y -= 30;
		if (this.y < 0) {
			this.destroy()
		}
	}
	get type(){
		return 'egg'
	}
}

class MonsterElement extends BaseElement {
	constructor(x, y, w, h) {
		super(x, y, w, h);
		this.image = new Image();
		this.image.src = monster;
	}
	update() {
		this.y += 10;
		if (this.y >= window.screen.height) {
			this.destroy();
		}
	}
	get type() {
		return "monster";
	}
}

class PlaneElement extends BaseElement {
	constructor(x, y, w, h) {
		super(x, y, w, h);
		this.image = new Image();
		this.image.src = plane;
		this.fireCD = 0
	}
	update(){
		if (this.fireCD === 0) {
			this.createChildren(EggElement, this.x , this.y , 50, 70)
			// debugger
			this.fireCD = 10
		}else {
			this.fireCD --
		}
	}
	get type(){
		return 'plane'
	}
}

export { EggElement, PlaneElement, MonsterElement };