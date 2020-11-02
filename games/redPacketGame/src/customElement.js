import redPacketImage from "./assets/image/redPacket.png"
import BaseElement from "core/baseElement.js";


class RedPacketElement extends BaseElement {
    constructor(x, y) {
        super(x, y)
        this.width = 50;
        this.height = 50;
        this.image = new Image();
        this.image.src = redPacketImage;
        this.on("tap", (event)=>{
            this.sendEvent(this.parent, 'addPoint', {point: 10})
            this.destroy()
        })
        this.destroyCountDown = 100;
    }
    update(){
        if (this.destroyCountDown > 0) {
            this.destroyCountDown--;
        } else {
            this.destroy();
        }
    }

    
}

export {RedPacketElement}