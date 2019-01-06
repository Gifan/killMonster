
const {ccclass, property} = cc._decorator;

@ccclass
export default class ShareTipsItem extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    onClose(){
        this.node.destroy();
    }
    // update (dt) {}
}
