import Common_CommonUtil from "../common/Common_CommonUtil";
import ShareSdk = require('../common/ShareSdk');
const { ccclass, property } = cc._decorator;
declare var window: any;
declare var EVENT_LISTENER: any;
@ccclass
export default class SkinItem extends cc.Component {

    @property(cc.Label)
    m_l_goldlabel: cc.Label = null;

    @property(cc.Sprite)
    m_sp_blockstyle: cc.Sprite = null;

    @property(cc.Node)
    m_n_isready: cc.Node = null;

    @property(cc.Button)
    m_btn_suitup: cc.Button = null;

    @property(cc.Label)
    m_l_sharetext: cc.Label = null;

    private _data: any = null;
    private _state: number = 0;
    private _index: number = 0;
    private _onshowback: boolean = false;

    start() {
        EVENT_LISTENER.on(window.ON_SHOW_BACK, this.onshowback, this);
    }

    onDestroy() {
        EVENT_LISTENER.off(window.ON_SHOW_BACK, this);
    }

    updateData(index: number, data: any, sframe) {
        this._index = index;
        this._data = data;
        let state = window.INIT_GAME_SAVE_DATA.skin[index];
        this._state = state ? state : 0;
        this.m_sp_blockstyle.spriteFrame = sframe;
        this.m_n_isready.active = this._state >= 2;
        this.m_btn_suitup.node.active = this._state < 2;
        this.m_l_goldlabel.string = data.price;
        if (this._state == 0) {//未获得
            if (data.way == 1 && window.SKIN_SHARE) { //分享获得且开关开启
                this.m_l_sharetext.node.active = true;
                this.m_l_goldlabel.node.parent.active = false;
                this.m_btn_suitup.interactable = true;
            } else {
                this.m_l_sharetext.node.active = false;
                this.m_l_goldlabel.node.parent.active = true;
                this.m_btn_suitup.interactable = window.INIT_GAME_SAVE_DATA.gold_num >= data.price;
            }
            this.m_btn_suitup.node.y = -145;
        } else if (this._state == 1) {
            this.m_l_sharetext.node.active = false;
            this.m_l_goldlabel.node.parent.active = false;
            this.m_btn_suitup.interactable = true;
            this.m_btn_suitup.node.y = -74;
        } else {
            this.m_l_sharetext.node.active = false;
            this.m_l_goldlabel.node.parent.active = false;
        }
    }

    onshowback(time) {
        if (this._onshowback) {
            if (time >= window.SHARE_TIME) {
                this.onSuitUp();
            } else {
                Common_CommonUtil.showShareFailTips();
            }
            this._onshowback = false;
        }
    }

    onSuitUp() {
        if (!this.m_btn_suitup.interactable) return;
        let skin_config = window.INIT_GAME_SAVE_DATA.skin;
        for (let i = 0; i < skin_config.length; i++) {
            if (skin_config[i] == 2) {
                window.INIT_GAME_SAVE_DATA.skin[i] = 1;
                window.INIT_GAME_SAVE_DATA.skin[this._index] = 2;
                break;
            }
        }
        if (this._state == 0) {
            if (this._data.way == 0 || !window.SKIN_SHARE) {
                window.INIT_GAME_SAVE_DATA.gold_num -= this._data.price;
                EVENT_LISTENER.fire(window.GAME_UPDATE_DATA);
            }else{
                this._onshowback = true;
                ShareSdk.shareAppMessage({
                    title: "获得了一个怪兽皮肤，快来看看吧",
                    imageUrl: window.tempFileURL[1],
                })
            }
        }
        // console.log(window.INIT_GAME_SAVE_DATA.skin)
        EVENT_LISTENER.fire(window.GAME_SAVE_HANDLER);
    }

}
