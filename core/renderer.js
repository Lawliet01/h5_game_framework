import { bfs } from "common/utils";
import { createImageElement } from "common/utils";

export class CanvasRenderer {
    constructor() {
        const canvas = document.createElement("canvas");
        this.canvas = canvas;
        canvas.style.position = "absolute";
        this.ctx = canvas.getContext("2d");
    }
    setDimension(parentX, parentY, parentWidth, parentHeight) {
        this.canvas.style.left = 0;
        this.canvas.style.top = 0;
        this.canvas.width = parentWidth;
        this.canvas.height = parentHeight;
    }
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    render() {}
}

export class BackgroundRenderer extends CanvasRenderer {
    constructor(bgImage) {
        super();
        this.bgImage = createImageElement(bgImage);
    }
    get type() {
        return "backgroundRenderer";
    }
    render() {
        this.bgImage.onload = () => {
            this.ctx.drawImage(this.bgImage, 0, 0, this.canvas.width, this.canvas.height);
        };
    }
}

export class ActorRenderer extends CanvasRenderer {
    constructor() {
        super();
        this.renderHandlers = new Map();
    }
    get type() {
        return "actorsRenderer";
    }
    setRender(type, handler) {
        this.renderHandlers.set(type, handler);
    }
    render(data) {
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
        this.clear();
        bfs(data.children, (actor) => {
            if (this.renderHandlers.has(actor.type)) {
                const renderHandler = this.renderHandlers.get(actor.type);
                renderHandler(this.ctx, actor, canvasWidth, canvasHeight);
            }
        });
    }
}

export class Renderer {
    constructor(canvasRendererArray) {
        this.canvasRendererArray = canvasRendererArray;
    }
    getRenderer(type) {
        return this.canvasRendererArray.find((each) => each.type === type);
    }
    createView(parent) {
        this.parent = parent;
        const parentDimension = parent.getBoundingClientRect();
        const { x, y, width, height } = parentDimension;
        for (let canvasRender of this.canvasRendererArray) {
            canvasRender.setDimension(x, y, width, height);
            this.parent.appendChild(canvasRender.canvas);
        }
    }
    clear() {
        this.canvasRendererArray.forEach((canvasRenderer) => canvasRenderer.clear());
    }
    render(data) {}
}
