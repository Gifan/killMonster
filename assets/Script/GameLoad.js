require("./common/Wxlife");
var ShareSdk = require("ShareSdk");
var Utils = require("Utils")
cc.Class({
    extends: cc.Component,

    properties: {
        m_n_logo: cc.Node,
        m_loaded: false,
        m_l_text: cc.Label,
    },

    start() {
        Utils.setDesignResolution()
        this.m_n_logo.opacity = 0;
        this.m_loaded = false;
        this.m_loaded2 = false;
        let self = this;
        this._loadnum = 0;
        this.m_n_logo.runAction(cc.sequence(cc.fadeIn(0.2), cc.callFunc(() => {
            self.loadres();
            self.loadconfig();
        })));
        // cc.view.enableRetina(true);
        let boo = cc.sys.localStorage.getItem('music');
        let guideboo = cc.sys.localStorage.getItem('guideinfo');
        let change = cc.sys.localStorage.getItem('change');
        if (boo && boo != 'null') {
            window.MUSIC_SHOW_OFF = parseInt(boo);
        } else {
            window.MUSIC_SHOW_OFF = 1;//默认开启
            cc.sys.localStorage.setItem('music', '' + window.MUSIC_SHOW_OFF);
        }

        if (guideboo && guideboo != 'null') {
            window.GUIDE_LEVEL = 1;
        } else {
            window.GUIDE_LEVEL = 0;
        }
        if (change && change != 'null') {
            window.CHANGE_BLOCK = 1;
        } else {
            window.CHANGE_BLOCK = 0;
        }
        ShareSdk.setShareMenuEnabled(true, true);

    },

    loadconfig() {
        let this$1 = this;
        this$1._loadnum++;
        this$1.enterGame();
    },

    loadres() {
        console.log("load res");
        let self = this;
        window.tempFileURL = [];
        for (let i = 1; i < 4; i++) {
            window.tempFileURL.push("");
        }
        if (typeof (tt) != 'undefined') {
            tt.showLoading({
                title: "登录中..."
            });
            cc.loader.loadRes('level_config2', function (err, obj) {
                if (err) {
                    cc.error(err.message || err);
                    return;
                }

                window.MAP_CONFIG = obj.json;
                self._loadnum++;
                self.enterGame();
            });
            //登录
            tt.login({
                force: false,
                success: (res) => {
                    window.isLogin = res.isLogin;
                    Utils.getSaveData(res => {
                        window.getdata = true;
                        self._loadnum++;
                        self.enterGame();
                    })
                },
                fail: (err) => {
                    this._loadnum++;
                    this.enterGame();
                }
            });
        } else {
            self._loadnum = 1;
            cc.loader.loadRes('level_config2', function (err, obj) {
                if (err) {
                    cc.error(err.message || err);
                    return;
                }

                window.MAP_CONFIG = obj.json;
                self._loadnum++;
                self.enterGame();
            });
        }

        cc.director.preloadScene(window.MENU_SCENE_NAME, (completedCount, totalCount, item) => {
            self.m_l_text.string = "游戏加载中..." + Math.floor((completedCount / totalCount) * 100) + "%";
        }, () => {
            console.log("preloadScene finish");
            self._loadnum++;
            self.enterGame();
        });
    },
    enterGame: function () {
        console.log("enterGame", this._loadnum);
        if (this._loadnum >= 4) {
            if (typeof (tt) != 'undefined')
                tt.hideLoading();
            cc.director.loadScene(window.MENU_SCENE_NAME);
        }
    }
});
