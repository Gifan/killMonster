import Common_CommonUtil from '../common/Common_CommonUtil'
var Utils = require("Utils");
var ShareSdk = require('ShareSdk');
cc.Class({
    extends: cc.Component,

    properties: {
        m_sp_tool: cc.Sprite,
        m_n_get: cc.Node,
        _tag: 0,
        m_sp_desclist: { type: cc.Node, default: [] },
        m_n_shareget: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        EVENT_LISTENER.on(window.ON_SHOW_BACK, this.onshowback, this);
        this.m_n_shareget.active = window.BOX_SHARE && !window.firstshare;
    },


    initToolInfo(tag, num, sp) {
        // console.log(tag, num)
        this._tag = tag;
        this.m_n_get.active = num <= 0;
    },

    onCloseClick() {
        this.node.active = false;
    },

    onUseClick() {
        if (this._tag == 0) {

        } else if (this._tag == 1) {
            if (window.GAME_CONTROL) {
                window.GAME_CONTROL.onUseStrong();
                this.onCloseClick();
            }
        }
    },

    onAdBtnClick(event, custom) {
        if (typeof (wx) != 'undefined') {
            let VersionToast = () => {
                wx.showToast({
                    title: "微信版本过低，无法看广告",
                    icon: "none",
                    image: "",
                    duration: 0,
                });
                setTimeout(() => wx.hideToast(), 2000);
            };
            let info = wx.getSystemInfoSync();
            if (info.SDKVersion >= '2.0.4') {
                this.showAd(custom);
            } else {
                VersionToast();
            }
        } else {
            // console.log('it is not wechat');
            this.videoReward(custom);
        }
    },

    showAd(custom) {
        let self = this;
        if (!this.m_videoAd) {
            this.m_videoAd = wx.createRewardedVideoAd({
                adUnitId: 'adunit-e573e466be94d7f5'
            });
        }
        this.m_videoAd.onError(err => {

        });

        this.m_videoAd.load()
            .then(() => {
                self.m_videoAd.show();
                self.m_videoAd.onClose((status) => {
                    self.m_videoAd.offClose();
                    if (status && status.isEnded || status === undefined) {
                        self.videoReward(custom);
                    } else {

                    }
                });
            })
            .catch(err => Utils.showTipsText("拉去视频广告失败，请稍候重试", null, null, null, 60, cc.Color.BLACK, 1.2));
    },

    videoReward(custom) {
        window.INIT_GAME_SAVE_DATA.tool[this._tag] += 1;
        Utils.showGetItem(1, 0, null, 0, 0);
        if (window.GAME_CONTROL) {
            window.GAME_CONTROL.updateToolsNum();
        }
    },

    onshowback(time) {
        if (this._onshowback) {
            if (time >= window.SHARE_TIME) {
                window.firstshare = true;
                this.m_n_shareget.active = window.BOX_SHARE && !window.firstshare;
                this.videoReward();
            } else {
                Common_CommonUtil.showShareFailTips();
            }
            this._onshowback = false;
        }
    },

    onGetClick() {
        if (window.INIT_GAME_SAVE_DATA.gold_num >= 20) {
            // Utils.showTipsText("购买成功", null, 0, 0, 60, cc.Color.WHITE, );
            Utils.showGetItem(1, 0, null, 0, 0);
            window.INIT_GAME_SAVE_DATA.gold_num -= 20;
            window.INIT_GAME_SAVE_DATA.tool[this._tag] += 1;
            if (window.GAME_CONTROL) {
                window.GAME_CONTROL.updateToolsNum();
            }
        } else {
            Utils.showTipsText("金币不足", null, 0, 0, 60, cc.Color.WHITE);
        }
    },

    onDestroy() {
        EVENT_LISTENER.off(window.ON_SHOW_BACK, this);
        if (this.m_videoAd) {
            this.m_videoAd.destroy();
            this.m_videoAd = null;
        }
    },

    onShareGet() {
        this._onshowback = true;
        ShareSdk.shareAppMessage({
            title: "快扶着这个炸弹，要爆啦！要爆啦！",
            imageUrl: window.tempFileURL[3],
        });
    }
    // update (dt) {},
});
