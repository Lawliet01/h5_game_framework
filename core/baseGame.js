import baseComponent from "./baseComponent";
import enableGesture from "./gesture.js";
import { bfs } from "common/utils";
// import Renderer from "./renderer.js";
import { runAnimation } from "core/runtime.js";


class Game extends baseComponent {
    constructor(renderer) {
        super();
        this.renderer = renderer
        this.actorsCanvas = this.renderer.getRenderer("actorsRenderer").canvas;
        this._handlePageEvent(this.actorsCanvas);
        this.status = 'ready'
    }
    _handlePageEvent(canvas) {
        const dispatchToActors = (eventName, event, targetOnElement) => {
            const child = this.children.filter((child) => child.hasEventListener(eventName));
            const canvasDimension = canvas.getBoundingClientRect();
            const clientX = event.detail.clientX - canvasDimension.x;
            const clientY = event.detail.clientY - canvasDimension.y;
            // console.log(clientX, clientY);
            for (let actor of this.children) { // 这里写得不好
                const { x, y, width, height } = actor.realDimension(canvasDimension.width,canvasDimension.height)
                // console.log(x, y, width, height);
                
                if (!targetOnElement || (clientX > x && clientY > y && clientX < x + width && clientY < y + height)) {
                    this.sendEvent(actor, eventName, event.detail);
                }
            }
        };
        enableGesture(canvas);
        // 提供管理事件能力 (拖动事件)
        canvas.addEventListener("panstart", (event) => {
            const pan = (event) => {
                dispatchToActors("pan", event, false);
            };

            const panend = (event) => {
                dispatchToActors("panend", event, false);
                canvas.removeEventListener("pan", pan);
                canvas.removeEventListener("panend", panend);
            };

            dispatchToActors("panstart", event, true);

            canvas.addEventListener("pan", pan);

            canvas.addEventListener("panend", panend);
        });

        // 点击事件
        canvas.addEventListener("tap", (event) => {
            dispatchToActors("tap", event, true);
        });
    }
    /**
     * 处理碰撞
     */
    _handleCollistion() {
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

        bfs(this.children, (child) => {
            child.executeCollistionQueue();
        });

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
    /**
     * 游戏实际运行
     */
    update() {} // 自己定义需要更新的部分
    _updateFrame(timeStep) {
        this.executeEvent();
        this.update(timeStep);
        this._handleCollistion();
        bfs(this.children, (eachNode) => {
            eachNode.updateFrame(timeStep);
        });
        this.renderer.render(this);
        return this.status === 'running'
    }
    win(){
        this.status = 'win'
        this.resolve(this.status)
    }
    lose(){
        this.status = 'lose'
        this.resolve(this.status);
    }
    async run() {
        this.status = 'running'
        return new Promise(resolve=>{
            this.resolve = resolve
            runAnimation(this._updateFrame.bind(this));
        })
    }
}

export default Game;
