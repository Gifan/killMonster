
cc.Class({
    extends: cc.Component,

    properties: {
    },

    start(){
        let size = cc.director.getWinSize();
        let content = this.node.getContentSize();
        this.node.scaleX = size.width / content.width;
        this.node.scaleY = size.height / content.height;
        // this.node.position = cc.p(0,0);
        window.adapt_scaleX = this.node.scaleX;
        window.adapt_scaleY = this.node.scaleY;
    },
});
