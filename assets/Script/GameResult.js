var RankList = require("RankList");
var Utils = require("Utils");
var ShareSdk = require("ShareSdk");
cc.Class({
    extends: cc.Component,

    properties: {
        m_n_fail: cc.Node,
        m_sp_titlef: cc.Node,
        m_btn_again: cc.Node,
        m_btn_share: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    showVictory(score) {

    },

    showFail(num, score, monster_num) {
        this._score = score;
        this._monster_num = monster_num;
        this.node.active = true;
        this.m_n_fail.active = true;
        this.m_n_fail.y = -cc.winSize.height / 2;
        this.m_n_fail.runAction(cc.sequence(cc.moveTo(0.5, 0, 0).easing(cc.easeIn(3.0)), cc.callFunc(() => {

        })));
        this.m_sp_titlef.stopAllActions();
        this.m_sp_titlef.runAction(cc.repeatForever(cc.sequence(cc.moveBy(0.5, 0, 10), cc.moveBy(0.5, 0, -10))));
        this.m_btn_again.active = true;
        this.m_btn_share.active = true;
        RankList.showGameResultList();
    },

    onBackToMenu() {
        Utils.SetSoundEffect(window.BUTTON_CLICK_MUSIC, false, 1);
        cc.director.loadScene(window.MENU_SCENE_NAME);
    },

    onAgainPlay() {
        Utils.SetSoundEffect(window.BUTTON_CLICK_MUSIC, false, 1);
        cc.director.loadScene(window.GAME_SCENE_NAME);
    },

    onResultShare() {
        let text = `宝宝要哭晕在山上了，快来帮帮它！`;
        ShareSdk.shareAppMessage({
            title: text,
            imageUrl: window.tempFileURL[2],
            success: res => {

            },
            fail: err => {

            },
            complate: msg => {

            },
        });
    },

    // onEnable(){

    // },

    // update (dt) {},
});
