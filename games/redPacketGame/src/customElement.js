import BaseElement from "core/baseElement.js";

class RedPacketElement extends BaseElement {
    constructor(x, y) {
        super(x, y)
        this.width = 20; // 相对位置
        this.height = 20; // 相对位置
        this.on("tap", (event)=>{
            this.sendEvent(this.parent, 'addPoint', {point: 10})
            this.destroy()
        })
        this.destroyCountDown = 1000;
    }
    get type(){
        return 'redPacket'
    }
    update(timeStep){
        if (this.destroyCountDown > 0) {
            this.destroyCountDown-=timeStep;
        } else {
            this.destroy();
        }
    }
}

export {RedPacketElement}