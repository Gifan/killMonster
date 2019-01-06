// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
// var Utils = require("Utils");
// var ShareSdk = require("ShareSdk");
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        // m_rqcode: cc.Node,
        // m_maskbg: cc.Node,
        // m_tips: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.setLocalZOrder(100);    //设置z轴的位置
        var size = cc.view.getVisibleSize()
        // this.m_maskbg.width = size.width;
        // this.m_maskbg.height = size.height;
        this.m_callbackobj = null;
    },

    start() {

    },

    onImageBtnClick() {
        // this.m_rqcode.active = !this.m_rqcode.active;
        wx.previewImage({
            urls:['https://h5game.gametall.com/chatgame/cocos_games_res/images/codeImage.jpg'],
        })
    },

    onSaveImageBtnClick() {
        if (window.isWeChatPlatform) {
            var self = this;
            wx.saveImageToPhotosAlbum({
                filePath: cc.url.raw('resources/common/saveImage.d2e1c.jpg'),
                success(res) {
                    self.showTipsView("二维码已保存成功")
                },
                fail(res) {
                    wx.openSetting({
                        authSetting: 'scope.writePhotosAlbum',
                        success() {
                            // console.log("======openSetting success=============");
                        },
                        fail() {
                            // console.log("======openSetting fail=============");
                        }
                    });
                }
            });
        }
    },

    onCloseBtnClick() {
        this.m_rqcode.active = false;
    },

    hideTipsView: function () {
        this.m_tips.getChildByName("TipsTex").getComponent(cc.Label).string = '';
        this.m_tips.active = false;
    },

    showTipsView: function (text) {
        this.m_tips.getChildByName("TipsTex").getComponent(cc.Label).string = text;
        this.m_tips.active = true;
    },

    // update (dt) {},
});
