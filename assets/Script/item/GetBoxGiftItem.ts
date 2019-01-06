import ShareSdk = require('../common/ShareSdk');
import Utils = require('../common/Utils');
import Common_CommonUtil from '../common/Common_CommonUtil';
const { ccclass, property } = cc._decorator;
declare var window: any;
declare var EVENT_LISTENER: any;
@ccclass
export default class GetBoxGiftItem extends cc.Component {

    @property(cc.Node)
    m_n_freebtn: cc.Node = null;

    @property(cc.Node)
    m_n_sharebtn: cc.Node = null;

    @property(cc.Node)
    m_n_box: cc.Node = null;
    private _onshowback: boolean = false;
    private _callback: any = null;
    start() {
        EVENT_LISTENER.on(window.ON_SHOW_BACK, this.onshowback, this);
    }

    showView(callback) {
        this._callback = callback;
        this.m_n_freebtn.active = !window.BOX_SHARE;
        this.m_n_sharebtn.active = window.BOX_SHARE;
        this.m_n_box.runAction(cc.sequence(cc.repeat(cc.sequence(cc.rotateTo(0.1, -10), cc.rotateTo(0.1, 10)), 3), cc.rotateTo(0.1, 0)));
    }

    onDestroy() {
        EVENT_LISTENER.off(window.ON_SHOW_BACK, this);
    }

    onshowback(time) {
        if (this._onshowback) {
            if (time >= window.SHARE_TIME) {
                this.onFreeGet();
            } else {
                Common_CommonUtil.showShareFailTips();
            }
            this._onshowback = false;
        }
    }

    onClose() {
        if (this._callback) {
            this._callback();
            this._callback = null;
        }
        this.node.active = false;
    }

    onFreeGet() {
        // Utils.showGetItem();
        let numlist = [1, 20];
        let index = 0;
        let ran = Utils.random(0, 1500);
        index = ran > 750 ? 0 : 1;
        Utils.showGetItem(numlist[index], index, null, 0, 0);
        if (index == 0) {
            window.INIT_GAME_SAVE_DATA.tool[0] += numlist[index];
        } else {
            window.INIT_GAME_SAVE_DATA.gold_num += numlist[index];
        }
        if (window.GAME_CONTROL) {
            window.GAME_CONTROL.BoxReward(index);
        }
        this.onClose();
    }

    onShareGet() {
        this._onshowback = true;
        ShareSdk.shareAppMessage({
            title: "我就看着你，直到你打开宝箱为止",
            imageUrl: window.tempFileURL[3],
        });
    }
    // update (dt) {}
}
