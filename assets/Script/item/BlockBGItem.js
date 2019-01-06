
cc.Class({
    extends: cc.Component,

    properties: {

        m_n_bright: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    },

    start() {

    },

    setBrightVisible(boo, color) {
        this.m_n_bright.active = boo;
        if(color){
            this.m_n_bright.color = cc.hexToColor(color);
        }
    },
    // update (dt) {},
});
