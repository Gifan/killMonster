import Common_CommonUtil from "../common/Common_CommonUtil";
import Utils = require("../common/Utils");
import ShareSDk = require("../common/ShareSdk");
const { ccclass, property } = cc._decorator;
declare var window: any;
declare var EVENT_LISTENER: any;
@ccclass
export default class StepViewItem extends cc.Component {
    // onLoad () {}
    private _callback = null;

    @property(cc.Sprite)
    m_sp_stepicon: cc.Sprite = null;

    @property(cc.Sprite)
    m_sp_stepname: cc.Sprite = null;

    @property([cc.Node])
    m_n_starlist: cc.Node[] = [];

    @property(cc.Node)
    m_n_bg: cc.Node = null;

    @property(cc.Label)
    m_l_steptitle: cc.Label = null;

    @property(cc.SpriteAtlas)
    m_spa_list: cc.SpriteAtlas = null;

    private _stepname = "";
    private _onshowback: boolean = false;
    start() {
        EVENT_LISTENER.on(window.ON_SHOW_BACK, this.onshowback, this);
    }

    onDestroy() {
        EVENT_LISTENER.off(window.ON_SHOW_BACK, this);
    }

    setCloseCallback(callback) {
        this._callback = callback;
    }

    onClose() {
        if (this._callback) this._callback();
        this.node.active = false;
    }

    onshowback(time) {
        if (this._onshowback) {
            this._onshowback = false;
            this.onClose();
        }
    }

    /**
     * 显示获得段位信息
     * @param lv 等级
     */
    showStep(lv: number) {
        let num = this.updateData(lv);
        for (let i = 0; i < this.m_n_starlist.length; i++) {
            this.m_n_starlist[i].active = false;
        }
        this.m_sp_stepicon.node.getComponent(cc.Animation).play('playstep');
        this.m_sp_stepname.node.getComponent(cc.Animation).play('playstep');
        this.scheduleOnce(() => {
            Common_CommonUtil.shakeScreen(this.m_n_bg);
        }, 0.4);
        for (let i = 0; i < num; i++) {
            this.m_n_starlist[i].active = true;
            this.m_n_starlist[i].scale = 0;
            this.scheduleOnce(() => {
                this.m_n_starlist[i].runAction(cc.sequence(cc.scaleTo(0.2, 1.4, 1.4).easing(cc.easeIn(3.0)), cc.scaleTo(0.1, 1, 1)));
                Utils.SetSoundEffect(window.GET_GOLD, false, 1);
            }, 0.54 + (i + 1) * 0.3);
        }
    }

    updateData(lv: number = 0): number {
        let index = Math.floor(lv / 10);
        let stepdata = window.STEP_CONFIG[index - 1];
        let num = 0;
        if (stepdata) {
            num = stepdata.star;
            this._stepname = stepdata.desc;
            this.m_l_steptitle.string = cc.js.formatStr("完成%d关 段位提升", lv);
            this.m_sp_stepicon.spriteFrame = this.m_spa_list.getSpriteFrame(stepdata.icon_path);
            this.m_sp_stepname.spriteFrame = this.m_spa_list.getSpriteFrame(stepdata.desc_path);
        }
        return num;
    }

    setShowBtnVisible(boo) {
        for (let i = 0; i < this.m_n_starlist.length; i++) {
            this.m_n_starlist[i].active = boo;
        }
        this.m_sp_stepicon.node.active = boo;
        this.m_sp_stepname.node.active = boo;
    }

    onShareStep() {
        this._onshowback = true;
        ShareSDk.shareAppMessage({
            title: "消除段位升级到【" + this._stepname + "】,一起来见证吧",
            imageUrl: window.tempFileURL[1],
        });
    }

    // update (dt) {}
}
