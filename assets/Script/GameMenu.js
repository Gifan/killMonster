var Utils = require("Utils");
var ShareSdk = require("ShareSdk");
var RankList = require("RankList");
cc.Class({
    extends: cc.Component,

    properties: {
        m_sp_logo: cc.Node,
        m_l_maingold: cc.Label,
        m_sp_off: cc.Node,
        m_spa_list: cc.SpriteAtlas,
        m_sp_mystepicon: cc.Sprite,
        m_l_mystepname: cc.Label,
        m_n_starlist: { type: cc.Node, default: [] },
        m_n_skinpanel: cc.Node,
        m_n_moregame: cc.Node,
        recored: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        window.GAME_MENU = this;
        Utils.setDesignResolution();
        cc.game.addPersistRootNode(this.recored);
    },

    start() {
        // this.m_sp_logo.runAction(cc.repeatForever(cc.sequence(cc.moveBy(1, 0, 15), cc.moveBy(1, 0, -15))));
        EVENT_LISTENER.on(window.GAME_UPDATE_DATA, this.updateGold, this);
        this.m_l_maingold.string = window.INIT_GAME_SAVE_DATA.gold_num;
        this.showGameClubButton();

        this.updateMusicBtnSprite(window.MUSIC_SHOW_OFF);
        RankList.setScore(window.INIT_GAME_SAVE_DATA.top_score);
        if (typeof (tt) != "undefined") {
            tt.showShareMenu({
                withShareTicket: true,
            });
            tt.onShareAppMessage(() => {
                return {
                    title: "好玩又新奇，消磨时间好帮手",
                    imageUrl: window.tempFileURL[1],
                }
            });
        }

        this.showAdBanner(true);
        if (!window.SHOWNEWYEAR && window.NEWYEAR) {
            Utils.loadRes("prefabs/happynewyear", cc.Prefab, (obj) => {
                let node = cc.instantiate(obj);
                node.zIndex = 1 << 10;
                node.parent = this.node;
                window.SHOWNEWYEAR = true;
            })
        } else {
            Utils.playBgmMusic(window.BGM, 0.5);
        }
        this.initMyData();
        this.m_n_moregame.active = false;//window.MOVEGAME;
    },

    playmuisc() {
        Utils.playBgmMusic(window.BGM, 0.5);
    },

    initMyData() {
        let curlv = window.INIT_GAME_SAVE_DATA.top_level;
        let data = this.getMyStepData(curlv);
        if (data) {
            this.m_sp_mystepicon.spriteFrame = this.m_spa_list.getSpriteFrame(data.icon_path);
            this.m_l_mystepname.string = data.desc;
            for (let i = 0; i < this.m_n_starlist.length; i++) {
                this.m_n_starlist[i].active = i < data.star;
            }
        } else {
            this.m_sp_mystepicon.spriteFrame = this.m_spa_list.getSpriteFrame("stepicon6");
            this.m_l_mystepname.string = window.STEP_CONFIG[0].desc;
            for (let i = 0; i < this.m_n_starlist.length; i++) {
                this.m_n_starlist[i].active = i < 3;
            }
        }

        this.m_n_skinpanel.getComponent("SkinPanel").initData();
    },

    getMyStepData(lv) {
        let index = Math.floor(lv / 10);
        if (index <= 0) {
            return null;
        } else {
            if (index > window.STEP_CONFIG.length)
                index = window.STEP_CONFIG.length;
            return window.STEP_CONFIG[index - 1];
        }
    },

    updateGold() {
        this.m_l_maingold.string = window.INIT_GAME_SAVE_DATA.gold_num;
    },

    onStartGame() {
        Utils.SetSoundEffect(window.BUTTON_CLICK_MUSIC, false, 1);
        cc.director.loadScene(window.GAME_SCENE_NAME);
    },

    onCloseShare() {
        cc.director.loadScene(window.GAME_SCENE_NAME);
    },

    onShareStart() {
        let self = this;
        Utils.SetSoundEffect(window.BUTTON_CLICK_MUSIC, false, 1);
        ShareSdk.shareAppMessage({
            templateId: "6mkah7c58jkj7l7lh5",
            success: res => {
                cc.director.loadScene(window.GAME_SCENE_NAME);
            },
            fail: err => {

            },
            complate: msg => {

            },
        });
    },

    onOpenSkinPanel() {
        this.m_n_skinpanel.active = true;
    },

    onOpenStepRank() {
        Utils.SetSoundEffect(window.BUTTON_CLICK_MUSIC, false, 1);
        if (window.isWeChatPlatform)
            wx.showLoading({ title: "加载中..." });
        cc.director.loadScene(window.STEP_SCENE_NAME, () => {
            if (window.isWeChatPlatform)
                wx.hideLoading();
        })
    },

    onMusicBtnClick() {
        if (window.MUSIC_SHOW_OFF == 1) {
            window.MUSIC_SHOW_OFF = 0;
            Utils.stopBgmMusic();
            cc.sys.localStorage.setItem('music', '0');
        }
        else {
            window.MUSIC_SHOW_OFF = 1;
            Utils.playBgmMusic(window.BGM, 0.5);
            cc.sys.localStorage.setItem('music', '1');
        }
        this.updateMusicBtnSprite(window.MUSIC_SHOW_OFF);
    },


    updateMusicBtnSprite(show_off) {
        if (show_off == 1) {
            this.m_sp_off.active = false;
        } else {
            this.m_sp_off.active = true;
        }
    },

    onShare() {
        Utils.SetSoundEffect(window.BUTTON_CLICK_MUSIC, false, 1);
        // console.log(cc.url.raw("resources/common/sharepic.85663.png"));
        ShareSdk.shareAppMessage({
            templateId: "6mkah7c58jkj7l7lh5",
            success: res => {
            },
            fail: err => {

            },
            complate: msg => {

            },
        });
    },

    onMoreGame() {
        if (typeof (wx) != 'undefined' && wx.navigateToMiniProgram) {
            wx.navigateToMiniProgram({
                appId: "wx7109309214f4c86e",
                //target: "wx6ee9cae077851dfa",
                success: res => {
                    console.log('跳转成功');
                    // successs && successs(res);
                },
                fail: err => {
                    console.log("跳转失败：", err);
                    // faill && faill(err);
                },
                complete: res => {
                    console.log('跳转完成')
                    // completee && completee(res);
                }
            });
        } else {
            wxShortCut.showModal("提示", "暂未开放");
        }
    },

    showGameClubButton() {
        if (typeof (wx) != 'undefined') {

        }
    },
    hideGameClubButton() {
        if (this.clubbutton) {
            this.clubbutton.hide();
        }
    },

    onDestroy() {
        if (this.clubbutton) {
            this.clubbutton.destroy();
            this.clubbutton = null;
        }
        if (this.m_bannerad) {
            this.m_bannerad.destroy();
            this.m_bannerad = null;
        }
        EVENT_LISTENER.off(window.GAME_UPDATE_DATA, this);
        window.GAME_MENU = null;
    },

    showAdBanner(boo) {
        if (typeof (tt) == 'undefined') return;
        // let Size = cc.winSize

        // let Widthnode = cc.find("Canvas/n_funnymap/n_bannerpos");
        // var pos = this.node.convertToWorldSpace(Widthnode);

        // if (Size.height / Size.width > 2) {//适配全面屏 适用于FIXHeight
        //     pos.y += (Size.height - 1920) / 2;
        // }

        const { windowWidth, windowHeight } = tt.getSystemInfoSync();
        var targetBannerAdWidth = 200;
        let self = this;
        if (this.m_bannerad) {
            this.m_bannerad.destroy();
            this.m_bannerad = null;
        }
        if (!this.m_bannerad && boo) {
            self.m_bannerad = tt.createBannerAd({
                adUnitId: 'adunit-9dd057b6b514245a',
                style: {
                    width: (windowWidth - targetBannerAdWidth) / 2,
                    top: windowHeight - (targetBannerAdWidth / 16) * 9 // 根据系统约定尺寸计算出广告高度
                }
            })
            self.m_bannerad.onResize((size) => {
                try {
                    if (self.m_bannerad && self.m_bannerad.style) {
                        self.m_bannerad.style.top = windowHeight - size.height;
                        self.m_bannerad.style.left = (windowWidth - size.width) / 2;
                    }
                } catch (error) {
                    console.log("onResize-error", error);
                }
            });
            self.m_bannerad.onLoad(() => {
                // console.log('banner 广告加载成功')
                self.m_bannerad.show().then(() => {
                    // console.log("广告显示成功");
                }).catch((err) => {
                    // console.error("广告加载失败", err);
                })
            })

            self.m_bannerad.onError(err => {
                // console.error(err)
            })
        }
    },
});
