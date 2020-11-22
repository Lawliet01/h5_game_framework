import Game from "core/baseGame.js";
import { RedPacketElement } from "./customElement";
import { bfs } from "common/utils";
import redPacketGameRenderer from "./customRenderer";
// import monsters from "./assets/image/monster.png"

class RedPacketGame extends Game {
    constructor(parent, options) {
        super(redPacketGameRenderer);
        redPacketGameRenderer.setConfig(options || {})
        redPacketGameRenderer.createView(parent);
        this.point = 0;
        this.time = 60000;
        this.cd = 0;
        this.on("addPoint", (data) => {
            this.point += data.point;
        });
    }
    update(timeStep) {
        if (this.time > 0) {
            this.time -= timeStep;
            this.generateRedPacket(timeStep);
        } else if (this.time <= 0) {
            this.time = 0;
            if (this.point > 200) {
                this.win();
            } else {
                this.lose();
            }
        }
    }
    generateRedPacket(timeStep) {
        if (this.cd <= 0) {
            this.cd = 300;
            this.createChildren(RedPacketElement, Math.random() * (100 - 20), Math.random() * (100 - 20));
        } else {
            this.cd -= timeStep;
        }
    }
}

// document.body.style.position = "relative";
// document.body.style.backgroundColor = "black";
// document.body.style.height = window.screen.height + "px";
// const game = new RedPacketGame(document.body);
// alert("点击确定开始游戏");
// (async function () {
//     const result = await game.run();
//     console.log("get result" + result);
// })();
export default RedPacketGame;
