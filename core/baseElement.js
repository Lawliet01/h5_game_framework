import baseComponent from "./baseComponent"

class BaseElement extends baseComponent {
    constructor(x = 0, y = 0, width = 0, height = 0) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.collisionListener = new Map();
        this.collistionHandleQueue = [];
    }
    realDimension(canvasWidth, canvasHeight) {
        // 渲染和交互的时候使用
        return {
            x: (this.x * canvasWidth) / 100,
            y: (this.y * canvasHeight) / 100,
            width: (this.width * canvasWidth) / 100,
            height: (this.height * canvasWidth) / 100,
        };
    }
    update() {
        // 自定义每一帧更新的逻辑
    }
    updateFrame(timeStep) {
        this.executeEvent();
        this.update(timeStep);
    }
    setPos(x, y) {
        this.x = x;
        this.y = y;
    }
    /**
     * 碰撞管理
     */
    setCollistionListener(elementType, handler) {
        this.collisionListener.set(elementType, () => {
            this.collistionHandleQueue.push((...args) => {
                return handler.call(this, ...args);
            });
        });
    }
    executeCollistionQueue() {
        while (this.collistionHandleQueue.length) {
            const handler = this.collistionHandleQueue.shift();
            handler();
        }
    }
}

// 初始化config
// 属性
// 方法 生成（静态方法）、
// 事件
// 生命周期 created、updated、destroyed

export default BaseElement