// import Data from './Common_Data';
var ShareSdk = require("ShareSdk");
var Utils = require("Utils");
var RankList = require('RankList');
cc.Class({
    extends: cc.Component,

    properties: {
        m_sp_rank_mask: cc.Node,
        display: cc.Sprite,        //刷新排行榜显示的sprite
        rankCloseBtn: cc.Node,     //返回主视图按钮
        playGameBtn: cc.Node,      //开始游戏按钮
        groudGameBtn: cc.Node,     //查看群排行按钮
    },

    start() {
        // this.isGroudBtn = true;

        this.tex = new cc.Texture2D();
        this.display.node.active = false;
        this.m_sp_rank_mask.active = false;
        this.isShow = false;
        EVENT_LISTENER.on(window.GAME_RANK_LISTENER, this.rankUpdate, this);
        this.isshowtrue = true;
        this.rankUpdate();
    },

    onEnable() {
        this.rankUpdate();
    },


    onDisable() {
        window.SHOW_RES = null;
    },

    onDestroy() {
        EVENT_LISTENER.off(window.GAME_RANK_LISTENER, this);
    },

    rankUpdate() {
        if (window.SHOW_RES && window.SHOW_RES.query.group) {
            this.ShowGroudRankClick({ query: window.SHOW_RES.query, shareTicket: window.SHOW_RES.shareTicket });
            if (this.isshowtrue)
                window.SHOW_RES = null;
        }
    },

    //查看好友排行按键事件
    onClick() {
        Utils.SetSoundEffect(window.BUTTON_CLICK_MUSIC, false, 1);
        this.rankCloseBtn.active = true;
        this.groudGameBtn.active = true;
        this.isShow = true;
        if(window.GAME_MENU) window.GAME_MENU.showAdBanner(false);
        // console.log("点击，发消息给子域");
        this.display.node.active = this.isShow;
        this.m_sp_rank_mask.active = this.isShow;
        // var masScoreStr = window.INIT_GAME_SAVE_DATA.top_level;
        // RankList.setScore(masScoreStr,
        //     (info) => {
        //         console.log("保存游戏信息成功！", info);
        //     },
        //     () => {
        //         console.log("保存游戏信息失败！");
        //     },
        //     (info) => {
        //         console.log("保存游戏信息已完成！", info);
        //     }
        // );

        RankList.showFriendList();
    },
    //查看群排行按键事件
    onGroudBtnClick() {
        Utils.SetSoundEffect(window.BUTTON_CLICK_MUSIC, false, 1);
        // Data.share(EChannelPrefix.grouprank, "group=2");
        ShareSdk.shareAppMessage({
            title: "我已经消灭了N个怪兽了，你呢？快来看看排名",
            imageUrl: window.tempFileURL[1],
            query: "group=2",
            success: res => {

            },
            fail: err => {

            },
            complate: msg => {

            },
        });
    },

    //返回主视图事件
    onCloseClick() {
        Utils.SetSoundEffect(window.BUTTON_CLICK_MUSIC, false, 1);
        this.isShow = false;
        this.display.node.active = false;
        this.m_sp_rank_mask.active = this.isShow;
        this.playGameBtn.active = false;
        this.groudGameBtn.active = false;
        this.rankCloseBtn.active = false;
        if(window.GAME_MENU) window.GAME_MENU.showAdBanner(true);
    },
    //开始游戏按键
    onPlayGameClick() {
        Utils.SetSoundEffect(window.BUTTON_CLICK_MUSIC, false, 1);
        // console.log("===============onPlayGameClick================");
        this.isShow = false;
        cc.director.loadScene(window.GAME_SCENE_NAME);
    },
    //刷新排行榜显示
    _updaetSubDomainCanvas() {
        if (!this.tex) {
            return;
        }
        this.tex.initWithElement(sharedCanvas);
        this.tex.handleLoadedTexture();
        this.display.spriteFrame = new cc.SpriteFrame(this.tex);
    },

    update(dt) {
        // this.ShowGroudRankClick();
        if (typeof (wx) != "undefined")
            this._updaetSubDomainCanvas();
    },


    ShowGroudRankClick(event) {
        Utils.SetSoundEffect(window.BUTTON_CLICK_MUSIC, false, 1);
        if(window.GAME_MENU) window.GAME_MENU.showAdBanner(false);
        if (event.query && event.shareTicket) {

            // console.log("=============ShowGroudRankClick================");
            // var masScoreStr = window.INIT_GAME_SAVE_DATA.top;
            // RankList.setScore(masScoreStr,
            //     (info) => {
            //         console.log("保存游戏信息成功！", info);
            //     },
            //     () => {
            //         console.log("保存游戏信息失败！");
            //     },
            //     (info) => {
            //         console.log("保存游戏信息已完成！", info);
            //     }
            // );
            RankList.showGroupList(event.shareTicket);
            this.isShow = true;
            this.display.node.active = this.isShow;
            this.m_sp_rank_mask.active = this.isShow;
            this.rankCloseBtn.active = true;
            this.playGameBtn.active = false;
            this.groudGameBtn.active = false;
        }
    },

});