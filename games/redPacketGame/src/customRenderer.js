import { CanvasRenderer, BackgroundRenderer, ActorRenderer, Renderer } from "core/renderer.js";
import { createImageElement } from "common/utils";
// import bgImage from "./assets/image/background.jpg";
import redPacketDefaultImage from "./assets/image/redPacket.png";

class MyActorRenderer extends ActorRenderer {
    setDimension(parentX, parentY, parentWidth, parentHeight) {
        this.canvas.style.left = 0;
        this.canvas.style.top = parentHeight * 0.2 + "px";
        this.canvas.width = parentWidth;
        this.canvas.height = parentHeight * 0.8;
    }
}

class PointRenderer extends CanvasRenderer {
    setDimension(parentX, parentY, parentWidth, parentHeight) {
        this.canvas.style.left = 0;
        this.canvas.style.top = 0;
        this.canvas.width = parentWidth;
        this.canvas.height = parentHeight * 0.2;
        this.ctx.fillStyle = "white";
        this.ctx.font = `${this.canvas.width / 15}px Arial`;
        this.ctx.textBaseline = "middle";
    }
    render(data) {
        this.clear();
        this.ctx.fillText(`分数: ${data.point}`, this.canvas.width / 10, this.canvas.height / 5);
        this.ctx.fillText(
            `时间: ${(data.time / 1000).toFixed(1)}`,
            this.canvas.width / 10,
            (2 * this.canvas.height) / 5
        );
    }
}

const pointRenderer = new PointRenderer();
const actorRenderer = new MyActorRenderer();

class RedPacketGameRenderer extends Renderer {
    setConfig(options){
        this.options = options
        const redPacketImage = options.redPacketImage ? options.redPacketImage : redPacketDefaultImage;
        const redPacketImageElement = createImageElement(redPacketImage);
        redPacketImageElement.onload = () => {
            actorRenderer.setRender('redPacket', (ctx, actor, canvasWidth, canvasHeight) => {
                const { x, y, width, height } = actor.realDimension(canvasWidth, canvasHeight);
                ctx.drawImage(redPacketImageElement, x, y, width, height);
            });
        };
    }
    render(gameData) {
        // if (!this.bgRendered) {
        //     const bgRenderer = this.getRenderer("backgroundRenderer");
        //     bgRenderer.render();
        //     this.bgRendered = true;
        // } else {
        for (let renderer of this.canvasRendererArray) {
            if (renderer.type !== "backgroundRenderer") renderer.render(gameData);
        }
        // }
    }
}

const redPacketGameRenderer = new RedPacketGameRenderer([actorRenderer, pointRenderer]);

// const backgroundRenderer = new BackgroundRenderer(bgImage);

export default redPacketGameRenderer;
