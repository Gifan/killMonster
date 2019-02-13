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
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        window.GAME_MENU = this;
        Utils.setDesignResolution();
    },

    start() {
        // this.m_sp_logo.runAction(cc.repeatForever(cc.sequence(cc.moveBy(1, 0, 15), cc.moveBy(1, 0, -15))));
        EVENT_LISTENER.on(window.GAME_UPDATE_DATA, this.updateGold, this);
        this.m_l_maingold.string = window.INIT_GAME_SAVE_DATA.gold_num;
        this.showGameClubButton();

        this.updateMusicBtnSprite(window.MUSIC_SHOW_OFF);
        RankList.setScore(window.INIT_GAME_SAVE_DATA.top_score);
        if (typeof (wx) != "undefined") {
            wx.showShareMenu({
                withShareTicket: true,
            });
            wx.onShareAppMessage(() => {
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
        this.m_n_moregame.active = window.MOVEGAME;
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
            title: "来助力我一起打怪兽吧",
            imageUrl: window.tempFileURL[1],
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
            title: "今年最好玩最刺激的六边形消除怪兽游戏，快来尝试下",
            imageUrl: window.tempFileURL[1],
            success: res => {
                console.log("res", res)
            },
            fail: err => {
                console.log("res-err")
            },
            complate: msg => {
                console.log("complate")
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
            if (!this.clubbutton) {
                this.clubbutton = wx.createGameClubButton({
                    icon: 'light',
                    style: {
                        left: 10,
                        top: 300,
                        width: 40,
                        height: 40
                    }
                });
            }
            this.clubbutton.show();
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
        if (typeof (wx) == 'undefined') return;
        let Size = cc.director.getWinSize();

        let Widthnode = cc.find("Canvas/n_funnymap/n_bannerpos");
        var pos = this.node.convertToWorldSpace(Widthnode);

        if (Size.height / Size.width > 2) {//适配全面屏 适用于FIXHeight
            pos.y += (Size.height - 1920) / 2;
        }

        let system = wx.getSystemInfoSync();

        let adaptScaleH = system.screenHeight / Size.height;
        var PosY = ((Size.height - pos.y) * adaptScaleH);

        let self = this;
        if (!boo) {
            if (this.m_bannerad) {
                this.m_bannerad.hide();
            }
        } else {
            if (this.m_bannerad)
                this.m_bannerad.show();
        }
        if (!this.m_bannerad && boo) {
            if (system.SDKVersion < '2.0.4') {
                wx.showToast({
                    title: "微信版本过低，无法创建广告banner",
                    icon: "none",
                    image: "",
                    duration: 0,
                });
                setTimeout(() => wx.hideToast(), 3000);
            } else {
                self.m_bannerad = wx.createBannerAd({
                    adUnitId: 'adunit-9dd057b6b514245a',
                    style: {
                        left: 0,
                        top: PosY,
                        width: system.screenWidth,
                    }
                })
                self.m_bannerad.onResize((res1) => {
                    try {
                        if (self.m_bannerad && self.m_bannerad.style) {

                            self.m_bannerad.style.top = PosY;
                            self.m_bannerad.style.height = res1.height;
                        }
                    } catch (error) {
                        console.log("onResize-error", error);
                    }
                });
                self.m_bannerad.onLoad(() => {
                    console.log('banner 广告加载成功')

                })
                self.m_bannerad.show().then(() => {
                    console.log("广告显示成功");
                }).catch((err) => {
                    console.error("广告加载失败", err);
                })
                self.m_bannerad.onError(err => {
                    console.error(err)
                })

            }
        }
    },
});
