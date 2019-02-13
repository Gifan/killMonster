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
        if (typeof (wx) != 'undefined') {
            wx.cloud.init({
                env: window.ENV,
                traceUser: true,
                success: (res) => {
                    // console.log("init-", res);
                }
            });
        }
        this.m_n_logo.runAction(cc.sequence(cc.fadeIn(0.2), cc.callFunc(() => {
            self.loadres();
            self.loadconfig();
        })));
        // cc.view.enableRetina(true);
        let boo = cc.sys.localStorage.getItem('music');
        let guideboo = cc.sys.localStorage.getItem('guideinfo');
        let change = cc.sys.localStorage.getItem('change');
        console.log('guideboo', guideboo);
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
            // cc.sys.localStorage.setItem('guideinfo', '1');
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
        let remoteUrl = 'https://gifen-1253495541.cosgz.myqcloud.com/KillMonster/share_config.json';
        cc.loader.load(remoteUrl, function (err, netobj) {
            if (err) {
                console.error(err);
                this$1._loadnum++;
                this$1.enterGame();
            } else {
                window.BOX_SHARE = netobj.box_share;
                window.SKIN_SHARE = netobj.skin_share;
                window.MOVEGAME = netobj.moregame;
                window.NEWYEAR = netobj.newyear;
                console.warn(netobj);
                this$1._loadnum++;
                this$1.enterGame();
            }
        });
    },

    loadres() {
        let self = this;
        if (typeof (wx) != 'undefined') {
            wx.showLoading({
                title: "登录中..."
            });

            wx.cloud.getTempFileURL({
                fileList: ['cloud://killmonster-test-df9a23.603e-killmonster-test-df9a23/game_config/level_config2.json',
                    'cloud://killmonster-test-df9a23.603e-killmonster-test-df9a23/share_templates/share1.jpg',
                    'cloud://killmonster-test-df9a23.603e-killmonster-test-df9a23/share_templates/share_normal.jpg',
                    'cloud://killmonster-test-df9a23.603e-killmonster-test-df9a23/share_templates/share_result.jpg',
                    'cloud://killmonster-test-df9a23.603e-killmonster-test-df9a23/share_templates/share_box.jpg'],
                success: (res) => {
                    // console.log(res.fileList[0]);
                    window.tempFileURL = [];
                    let data = res.fileList[0];
                    for (let i = 1; i < res.fileList.length; i++) {
                        window.tempFileURL.push(res.fileList[i].tempFileURL);
                    }

                    if (data.status == 0) {
                        cc.loader.load(data.tempFileURL, function (err, netobj) {
                            if (err) {
                                cc.loader.loadRes('level_config2', function (err, obj) {
                                    if (err) {
                                        cc.error(err.message || err);
                                        return;
                                    }
                                    window.MAP_CONFIG = obj;
                                    window.dailypointdata = obj.daily_step;
                                    self._loadnum++;
                                    self.enterGame();
                                });
                            } else {
                                window.MAP_CONFIG = netobj
                                self._loadnum++;
                                self.enterGame();
                            }
                        });
                    } else {
                        cc.loader.loadRes('level_config', function (err, obj) {
                            if (err) {
                                cc.error(err.message || err);
                                return;
                            }
                            window.MAP_CONFIG = obj;
                            self._loadnum++;
                            self.enterGame();
                        });
                    }
                },
                fail: () => {
                    cc.loader.loadRes('level_config2', function (err, obj) {
                        if (err) {
                            cc.error(err.message || err);
                            return;
                        }
                        window.MAP_CONFIG = obj;
                        self._loadnum++;
                        self.enterGame();
                    });
                }
            })
            //登录
            wx.cloud.callFunction({
                // 云函数名称
                name: 'login',
                // 传给云函数的参数
                success: function (res) {
                    console.log(res)
                    window.userInfo = res.result;
                    Utils.getSaveData(res => {
                        window.getdata = true;
                        self._loadnum++;
                        self.enterGame();
                    })
                },
                fail: (err) => {
                    console.error(err);
                    wx.showModal({
                        title: "提示",
                        content: "登录异常，请稍后重试:" + err.Msg,
                        showCancel: false,
                        success: () => {
                            wx.exitMiniProgram();
                        }
                    })
                }
            })
        } else {
            self._loadnum = 1;
            cc.loader.loadRes('level_config2', function (err, obj) {
                if (err) {
                    cc.error(err.message || err);
                    return;
                }
                window.MAP_CONFIG = obj;
                self._loadnum++;
                self.enterGame();
            });
        }

        this.MyPreloadScene(window.MENU_SCENE_NAME, (completedCount, totalCount, item) => {
            self.m_l_text.string = "游戏加载中..." + Math.floor((completedCount / totalCount) * 100) + "%";
        }, () => {
            console.log("preloadScene finish");
            self._loadnum++;
            self.enterGame();
        });
    },

    MyPreloadScene(sceneName, onProgress, onLoaded) {
        if (onLoaded === undefined) {
            onLoaded = onProgress;
            onProgress = null;
        }

        var info = cc.director._getSceneUuid(sceneName);
        if (info) {
            cc.director.emit(cc.Director.EVENT_BEFORE_SCENE_LOADING, sceneName);
            cc.loader.load({ uuid: info.uuid, type: 'uuid' },
                onProgress,
                function (error, asset) {
                    if (error) {
                        cc.errorID(1210, sceneName, error.message);
                    }
                    if (onLoaded) {
                        onLoaded(error, asset);
                    }
                });
        }
        else {
            var error = 'Can not preload the scene "' + sceneName + '" because it is not in the build settings.';
            onLoaded(new Error(error));
            cc.error('preloadScene: ' + error);
        }
    },
    enterGame: function () {
        if (this._loadnum >= 4) {
            if (typeof (wx) != 'undefined')
                wx.hideLoading();
            cc.director.loadScene(window.MENU_SCENE_NAME);
        }
    }
});
