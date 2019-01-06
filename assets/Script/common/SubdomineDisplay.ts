
const { ccclass, property } = cc._decorator;

@ccclass
export default class SubdomineDisplay extends cc.Component {

    private display: cc.Sprite;
    private tex: cc.Texture2D;

    start() {
        this.display = this.node.getComponent(cc.Sprite);
        this.tex = new cc.Texture2D();
        this.display.node.active = true;
        let self = this;
        this.schedule(() => {
            self._updateSubDomainCanvas()
        }, 1);
    }

    _updateSubDomainCanvas() {
        if (!this.node.active) return;
        if (typeof (wx) == "undefined")
            return;
        if (!this.tex) {
            return;
        }
        this.tex.initWithElement(sharedCanvas);
        this.tex.handleLoadedTexture();
        this.display.spriteFrame = new cc.SpriteFrame(this.tex);
    }

    // update() {

    // }
    onDestroy() {
        this.unscheduleAllCallbacks();
    }
};