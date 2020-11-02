import Game from "core/baseGame.js";
import { RedPacketElement } from "./customElement";
import { bfs } from "common/utils";

class RedPacketGame extends Game {
    constructor() {
        super();
        this.point = 0;
        this.time = 60000;
        this.cd = 0;
        this.on("addPoint", (data) => {
            this.point += data.point;
            console.log(this.point);
        });
    }
    update(timeStep) {
        if (this.time > 0) {
            this.time -= timeStep;
            this.generateRedPacket();
        } else if (this.time <= 0) {
            this.time = 0
            if (this.point > 200) {
                this.win()
                console.log('You win');
            } else {
                this.lose()
                console.log('You lose');
            }
        }
    }
    generateRedPacket() {
        if (this.cd === 0) {
            this.cd = 100;
            const windowWidth = window.screen.width;
            const windowHeight = window.screen.height;
            const randomNum = (from, to) => Math.random() * (to - from) + from;
            this.createChildren(RedPacketElement, randomNum(0, windowWidth - 50), randomNum(0, windowHeight - 50));
        } else {
            this.cd--;
        }
    }
}

const game = new RedPacketGame();
alert("点击确定开始游戏");
game.run();
// export default RedPacketGame;
