let Utils = require("Utils");
let ShareSdk = require("ShareSdk");
let RankList = require("RankList");
cc.Class({
    extends: cc.Component,

    properties: {
        m_n_gamenode: cc.Node,
        m_n_bg_panel: cc.Node,
        m_pre_blockbg: cc.Prefab,
        m_pre_light: cc.Prefab,
        m_pre_boomeffect: cc.Prefab,
        m_pre_boom: cc.Prefab,
        m_l_boomnum: cc.Label,
        m_l_score: cc.Label,
        m_sp_monster: cc.Sprite,
        m_l_level: cc.Label,
        m_n_result_panel: cc.Node,
        m_btn_tool2: cc.Node,
        m_n_guidemask: cc.Node,
        m_n_tooluse: cc.Node,
        m_n_showtime: {
            type: cc.Node,
            default: []
        },
        m_spf_gold: cc.SpriteFrame,
        m_n_askpanel: cc.Node,
        m_n_boss: cc.Node,
        m_spriteAtlas: cc.SpriteAtlas,
        m_n_bglist: cc.Node,
        m_l_gold: cc.Label,
        m_pre_rock: cc.Prefab,
        m_n_kuai: {
            type: cc.Node,
            default: []
        },
        m_n_displaycheck: cc.Node,
        m_n_displayrank: cc.Node,
        m_n_stepview: cc.Node,
        m_n_reliveview: cc.Node,
        m_n_video: cc.Node,
        m_n_lookvideo: cc.Node,
        m_n_luckyvideo: cc.Node,
        m_n_doublevideo: cc.Node,
        m_n_doublescore: cc.Node,
        m_n_sharegift: cc.Node,
        m_n_skinpanel: cc.Node,
        m_n_guidenode: cc.Node,
        m_l_asktype: cc.Label,
        m_n_guidefiger: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        window.GAME_CONTROL = this;
        Utils.setDesignResolution();
    },

    onDestroy() {
        this.m_block_pool.clear();
        this.m_light_pool.clear();
        window.GAME_CONTROL = null;
        if (this.m_bannerad) {
            this.m_bannerad.destroy();
            this.m_bannerad = null;
        }
        EVENT_LISTENER.off(window.GAME_UPDATE_DATA, this);
        EVENT_LISTENER.off(window.GAME_SAVE_HANDLER, this);
    },

    start() {
        if (window.firstGame)
            window.firstGame = false;
        this.createMap();
        this.initData();
        this.initMonster(this.m_cur_level);
        this.showAdBanner(false);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        EVENT_LISTENER.on(window.GAME_UPDATE_DATA, this.updateGold, this);
        EVENT_LISTENER.on(window.GAME_SAVE_HANDLER, this.updateSkin, this);
    },

    initData() {
        this.m_n_skinpanel.getComponent("SkinPanel").initData();
        this.m_n_displaycheck.active = true;
        this.m_n_displayrank.active = false;
        this.m_n_lookvideo.active = false;
        this.m_n_doublescore.active = false;
        this.m_gamestate = 0;
        this.m_cur_score = 0;
        this.m_cur_level = window.INIT_GAME_SAVE_DATA.top_level + 1;
        this.m_normal_talktime = 4; //怪物说话间隔
        this.m_normal_curtime = -1;
        this.m_target_block = [];
        this.m_mapblink = false;
        this.m_touch_boom = false;
        this._relivenum = 0;
        this._videonum = 0;
        this._killnum = 0;
        this.m_l_score.string = this.m_cur_score;
        this.m_doublescore = 1;
        // this.m_l_solidernum.string = "X" + this.m_solidernum;
        this.m_l_level.string = "LV." + this.m_cur_level;
        this.m_l_gold.string = window.INIT_GAME_SAVE_DATA.gold_num;
        this._isdeleting = false //判断是否正在消除的依据
        this._isbless = false; //是否已经恩赐过
        this.m_block_pool = new cc.NodePool();
        this.m_light_pool = new cc.NodePool();
        this.updateToolsNum();
        this.schedule(function () {
            this.m_btn_tool2.runAction(cc.sequence(cc.repeat(cc.sequence(cc.rotateTo(0.1, -10), cc.rotateTo(0.1, 10)), 3), cc.rotateTo(0.1, 0)));
            this.m_n_video.runAction(cc.sequence(cc.delayTime(1.0), cc.repeat(cc.sequence(cc.rotateTo(0.1, -10), cc.rotateTo(0.1, 10)), 3), cc.rotateTo(0.1, 0)));
            this.m_n_doublevideo.runAction(cc.sequence(cc.delayTime(2.0), cc.repeat(cc.sequence(cc.rotateTo(0.1, -10), cc.rotateTo(0.1, 10)), 3), cc.rotateTo(0.1, 0)))
        }, 5);
        this._configlist = this.m_n_kuai[i].getComponent("ShapeItem").getTheConfig();
        RankList.checkWillSurpass(this.m_cur_score);

        let rand = Utils.random(0, 1000);

        this.m_n_luckyvideo.active = rand <= 500 && this.m_cur_level > 1;
        if (this.m_n_luckyvideo.active) {//第一关不出现
            this.m_n_luckyvideo.scale = 0;
            this.m_n_luckyvideo.runAction(cc.sequence(cc.scaleTo(0.2, 1.2, 1.2).easing(cc.easeIn(3.0)), cc.scaleTo(0.1, 1, 1)));
            if (window.SKIN_SHARE) {
                let node = cc.find("btn_cancel", this.m_n_luckyvideo);
                node.y = -570;
                this.scheduleOnce(() => {
                    node.y = -514;
                    if (this.m_n_luckyvideo.active && !this.showAdb)
                        this.showAdBanner(true);
                }, 1.8)
            }
        }
    },

    hideGuide() {
        if (this.m_cur_level == 1) {
            this.m_n_guidenode.active = false;
            this.m_n_guidefiger.stopAllActions();
            this.m_n_guidefiger.active = false;
            window.GUIDE_LEVEL = 1;
            cc.sys.localStorage.setItem('guideinfo', '1');
        }
    },

    showGuide() {
        if (!this._tempguide) {
            this._tempguide = true;
        } else { return; }
        let typeindex = 0;
        let indexlist = window.INIT_GAME_SAVE_DATA.skin;
        for (let i = 0; i < indexlist.length; i++) {
            if (indexlist[i] >= 2) {
                typeindex = i;
                break;
            }
        }

        let data = window.SKIN_CONFIG[typeindex];
        this.m_n_guidenode.active = true;
        this.m_n_guidefiger.active = true;
        this.m_n_guidefiger.position = this.m_n_kuai[1].position;
        this.m_n_guidefiger.runAction(cc.repeatForever(cc.sequence(cc.callFunc(() => {
            this.m_n_guidefiger.position = this.m_n_kuai[1].position;
        }), cc.moveTo(1.0, this.m_n_kuai[1].x, this.m_n_kuai[1].y + 350))));
        let index = this.m_n_kuai[0].getComponent("ShapeItem").getCurColorIndex();
        let blockindex = [];
        blockindex[46] = 1;
        blockindex[52] = 1;
        blockindex[53] = 1;
        blockindex[58] = 1;
        for (let i = 43; i < 61; i++) {
            if (blockindex[i]) {
                // this.m_maparray[i].getComponent("BlockBGItem").setBrightVisible(true, '#000000');
            } else {
                let node = new cc.Node("colorSpr");
                node.colorIndex = index;
                node.colorName = data.name;
                let sprite = node.addComponent(cc.Sprite);
                console.log(data.name, index);
                sprite.spriteFrame = this.m_spriteAtlas.getSpriteFrame(data.name + index);
                node.position = cc.Vec2.ZERO;
                node.parent = this.m_maparray[i];
                this.m_maparray[i].isHaveFK = true;
            }
        }
    },

    onKeepGoing() {
        this.m_n_luckyvideo.active = false;
        this.showAdBanner(false);
    },

    touchEnd(event) {
        if (this.m_gamestate == 0 && this.m_touch_boom) {
            this.m_gamestate = 2;
            let vec = event.touch.getLocation();
            vec = this.m_n_gamenode.convertToNodeSpace(vec);
            let index = this.backIndexofList(vec);
            if (index >= 0) {
                if (!this.m_maparray[index].isHaveFK) {
                    this.m_maparray[index].isHaveFK = true;
                    let node = cc.instantiate(this.m_pre_boom);
                    node.parent = this.m_maparray[index];
                    window.INIT_GAME_SAVE_DATA.tool[0] -= 1;
                    this.updateToolsNum();
                    this.doBoomAction(this.m_maparray[index].position, index);
                }
            }
            this.m_n_guidemask.active = !this.m_mapblink;
            this.m_touch_boom = !this.m_mapblink;
            this.setMapBlink(!this.m_mapblink);
            this.m_gamestate = 0;
            for (let i = 0; i < this.m_n_kuai.length; i++) {
                let shapeitem = this.m_n_kuai[i].getComponent("ShapeItem");
                if (shapeitem.checkIsLose()) {
                    this.m_n_kuai[i].opacity = 125;
                } else {
                    this.m_n_kuai[i].opacity = 255;
                }
            }
        }
    },

    doBoomAction(pos, index) {
        let FKNode = this.m_maparray[index].getChildByName("colorSpr")
        //这个假方块变大并且渐隐掉
        FKNode.runAction(cc.sequence(
            cc.spawn(cc.scaleTo(0.5, 2), cc.fadeOut(0.5)),
            cc.removeSelf(true)
        ));
        this.m_maparray[index].isHaveFK = null;
        this.scheduleOnce(() => {
            let node = cc.instantiate(this.m_pre_boomeffect);
            node.parent = this.m_n_gamenode;
            node.position = pos;
            node.y -= 100;
            node.zIndex = 1 << 8;
            node.getComponent(cc.Animation).play("bombeffect");
            Utils.SetSoundEffect(window.BOOM_EFFECT, false, 1);
        }, 0.4);
        let list = this.getBoomIndexList(index);
        console.log(list);
        let count = 0;
        let actionAry = [];
        actionAry.push(cc.delayTime(0.4));
        for (let i = 0; i < list.length; i++) {
            let oneList = list[i];
            for (let j = 0; j < oneList.length; j++) {
                let xIndex = oneList[j];
                if (this.m_maparray[xIndex].isHaveFK) {
                    actionAry.push(cc.callFunc(function () {
                        let xIndex = arguments[1][0]
                        let count = arguments[1][1];
                        let score = this.getAddScoreCal(count);
                        Utils.showHurtText("+" + score, this.m_n_gamenode, this.m_maparray[xIndex].x, this.m_maparray[xIndex].y, 20, null, null, null, true);
                        this.updateScore(score)
                    }, this, [xIndex, count]))

                    actionAry.push(cc.callFunc(function () {
                        let xIndex = arguments[1]
                        this.m_maparray[xIndex].isHaveFK = null
                        let FKNode = this.m_maparray[xIndex].getChildByName("colorSpr")
                        if (!FKNode) {
                            return //防止没有这个方块的时候
                        }
                        this.attackMonster(FKNode.colorIndex, this.m_maparray[xIndex].x, this.m_maparray[xIndex].y);
                        //这个假方块变大并且渐隐掉
                        FKNode.runAction(cc.sequence(
                            cc.spawn(cc.scaleTo(0.5, 2), cc.fadeOut(0.5)),
                            cc.removeSelf(true)
                        ))

                    }, this, xIndex));
                    count++
                }
            }
            actionAry.push(cc.delayTime(0.3))
        }

        if (actionAry.length > 0) {
            // Utils.SetSoundEffect(window.GET_GOLD, false, 1);
            actionAry.push(cc.callFunc(function () {
                this._isdeleting = false
                this.checkIsLose()
            }, this))
            this._isdeleting = true
            let action = cc.sequence(actionAry)
            this.node.runAction(action);
        }
    },

    /**
     * 根据炸弹下标获取范围引爆范围
     * @param {炸弹下标} index 
     */
    getBoomIndexList(index) {
        return window.boomrange[index];
    },

    bombFinish() {

    },
    /**
     * 获取可以放置的方格 3个
     */
    getCanDropBlocks() {
        let canDroplsit = [0, 0, 0];
        for (let k = this._configlist.length - 1; k >= 1; k--) {
            //一个个格子放试一下能不能放
            for (var i = 0; i < this.m_maparray.length; i++) {
                var frameNode = this.m_maparray[i]
                var srcPos = cc.p(frameNode.x, frameNode.y)
                var count = 1
                if (!frameNode.isHaveFK) {
                    //这里做是否可以放的判断
                    let children = this._configlist[k];
                    for (var j = 1; j < children.length; j++) {
                        var len = 52 //碰撞距离
                        var childPos = cc.pAdd(srcPos, cc.p(children[j].x, children[j].y))
                        //碰撞检测
                        for (var s = 0; s < this.m_maparray.length; s++) {
                            var tFrameNode = this.m_maparray[s]
                            var dis = cc.pDistance(cc.p(tFrameNode.x, tFrameNode.y), childPos)
                            if (dis <= len && !tFrameNode.isHaveFK) {
                                count++ //可以放就要累加计数
                            }
                        }
                    }
                    //如果数量相等就说明这个方块在这个格子是可以放下的
                    if (count == children.length) {
                        canDroplsit.push(k);
                        break;
                    }
                }
            }
        }
        if (canDroplsit.length > 3) {
            let arr = Utils.getRandomSDiff(0, canDroplsit.length - 1, 3);
            return [canDroplsit[arr[0]], canDroplsit[arr[1]], canDroplsit[arr[2]]];
        } else {
            return [canDroplsit[0], canDroplsit[1], canDroplsit[2]];
        }
    },

    backIndexofList(pos) {
        for (let i = 0; i < window.INDEX_TO_POINT.length; i++) {
            if (cc.pDistance(pos, cc.v2(window.INDEX_TO_POINT[i][0], window.INDEX_TO_POINT[i][1])) <= 50) {
                return i;
            }
        }
        return -1;
    },

    updateToolsNum() {
        this.m_boomnum = window.INIT_GAME_SAVE_DATA.tool[0];
        this.m_l_boomnum.string = "x" + this.m_boomnum;
        this.setAddVisible(this.m_btn_tool2, this.m_boomnum);
        this.updateGold();
    },

    updateGold() {
        this.m_l_gold.string = window.INIT_GAME_SAVE_DATA.gold_num;
    },

    updateSkin() {
        console.log('updateskin')
        let data_index = 0;
        for (let i = 0; i < this.m_n_kuai.length; i++) {
            data_index = this.m_n_kuai[i].getComponent("ShapeItem").updateIndex(true);
        }
        let data = window.SKIN_CONFIG[data_index];
        for (let j = 0; j < this.m_maparray.length; j++) {
            let FKNode = this.m_maparray[j].getChildByName("colorSpr");
            if (FKNode) {
                FKNode.getComponent(cc.Sprite).spriteFrame = this.m_spriteAtlas.getSpriteFrame(data.name + FKNode.colorIndex);
            }
        }
    },

    setAddVisible(node, num) {
        let addbtn = cc.find("sp_add", node);
        addbtn.active = num <= 0;
    },

    updateScore(score) {
        this.m_cur_score += score;
        this.m_l_score.string = this.m_cur_score;
        if (!this.m_n_result_panel.active)
            RankList.checkWillSurpass(this.m_cur_score);
        if (this.m_cur_score > window.INIT_GAME_SAVE_DATA.top_score) {
            window.INIT_GAME_SAVE_DATA.top_score = this.m_cur_score;
            RankList.setScore(window.INIT_GAME_SAVE_DATA.top_score);
        }
    },

    createMap() {
        this.m_maparray = [];
        let frameList = [];
        for (let index = 0; index < window.INDEX_TO_POINT.length; index++) {
            let node = cc.instantiate(this.m_pre_blockbg);
            node.x = window.INDEX_TO_POINT[index][0];
            node.y = window.INDEX_TO_POINT[index][1];
            node.parent = this.m_n_bglist;
            node.FKIndex = index;
            frameList.push(node)
        }
        this.m_maparray = frameList;
    },

    //创建糖果
    initMonster(level) {
        let self = this;
        let lv = level % 100;
        if (lv <= 0) lv += 1;
        let data = window.MAP_CONFIG[lv - 1];

        this.m_sp_monster.node.getComponent("MonsterItem").initType(data.mon_id, data.mon_hp, level);
        // this.m_sp_monster.node.color = window.MON_COLOR[data.color];
        this.m_sp_monster.node.active = true;
        this.m_sp_monster.node.opacity = 255;
        this.m_sp_monster.node.y = 300;
        let y = 0;
        this.m_sp_monster.node.getComponent("MonsterItem").playStartTalk();
        if (data.mon_id == 0) {
            // this.m_sp_monster.node.y = -10;
            y = -10;
        } else {
            // this.m_sp_monster.node.y = 0;
        }

        this.m_sp_monster.node.runAction(cc.moveTo(0.4, 0, y).easing(cc.easeIn(3.0)));

        if (level % 5 == 0) {
            this.m_n_boss.active = true;
            this.m_n_boss.opacity = 50;
            this.m_n_boss.scale = 2.5;
            let offset = 10;
            let deltaTime = 0.02;
            this.m_n_boss.runAction(cc.sequence(cc.spawn(cc.scaleTo(0.8, 1.0).easing(cc.easeBackIn(3.0)), cc.fadeTo(0.8, 255)), cc.moveBy(deltaTime, cc.p(offset * 2, 0)),
                cc.moveBy(deltaTime * 2, cc.p(-offset * 4)),
                cc.moveBy(deltaTime, cc.p(offset * 2)),

                cc.moveBy(deltaTime, cc.p(0, offset * 2)),
                cc.moveBy(deltaTime * 2, cc.p(0, -offset * 4)),
                cc.moveBy(deltaTime, cc.p(0, offset * 2)),

                cc.moveBy(deltaTime, cc.p(offset, 0)),
                cc.moveBy(deltaTime * 2, cc.p(-offset * 2, 0)),
                cc.moveBy(deltaTime, cc.p(offset, 0)),

                cc.moveBy(deltaTime, cc.p(0, offset)),
                cc.moveBy(deltaTime * 2, cc.p(0, -offset * 2)),
                cc.moveBy(deltaTime, cc.p(0, offset)),
                cc.fadeOut(1.5)));
        }
    },


    //加分，参数是消除的总数,isDropAdd是是否是放下的单纯加分
    addScore: function (XCCount, isDropAdd) {
        let addScoreCount = this.getAddScoreCal(XCCount, isDropAdd)
        Utils.showHurtText("+" + addScoreCount, null, 0, 0, 30);
        this.updateScore(addScoreCount);
    },

    //计算加分的公式
    getAddScoreCal: function (XCCount, isDropAdd) {
        let x = XCCount + 1
        let addScoreCount = isDropAdd ? x : x * x //数量的平方
        return addScoreCount * this.m_doublescore;
    },

    //检测是不是输了
    checkIsLose: function () {
        //如果正在消除中，那就不判断输赢，因为消除后会再判断
        if (this._isdeleting) return
        this.m_normal_curtime = 0;
        let count = 0
        for (let i = 0; i < 3; i++) {
            let node = cc.find('n_kuai' + (i + 1), this.m_n_gamenode)
            let script = node.getComponent('ShapeItem');
            if (script.checkIsLose()) {
                count++
                node.opacity = 125
            } else {
                node.opacity = 255
            }
        }
        if (count >= 2 && !this._isbless) {
            this._isbless = true;
            for (let i = 0; i < 3; i++) {
                let node = cc.find('n_kuai' + (i + 1), this.m_n_gamenode)
                node.getComponent('ShapeItem').setNextBlock(0); //设置下一个必定是某个形状
            }
        }
        if (count == 3) { //没地方放了
            this.judgeGame(false);
        }
    },

    //检查是否有可消除
    checkClearUp() {
        let haveFKIndexList = []
        for (let i = 0; i < this.m_maparray.length; i++) {
            if (this.m_maparray[i].isHaveFK) {
                haveFKIndexList.push(this.m_maparray[i].FKIndex)
            }
        }
        haveFKIndexList.sort(function (a, b) {
            return a - b
        });
        let xcList = [] //要消除的方块列表
        for (let i = 0; i < window.DISLIST.length; i++) {
            let oneXCList = window.DISLIST[i]
            let intersectAry = this.get2AryIntersect(haveFKIndexList, oneXCList) //求数组交集
            if (intersectAry.length > 0) {
                let isXC = this.check2AryIsEqual(oneXCList, intersectAry) //数组相同，消除
                if (isXC) {
                    xcList.push(oneXCList)
                }
            }
        }
        let actionAry = [];
        //消除
        let count = 0;
        let clearnum = 0;
        for (let i = 0; i < xcList.length; i++) {
            let oneList = xcList[i];
            clearnum += oneList.length;
            for (let j = 0; j < oneList.length; j++) {
                let xIndex = oneList[j]
                actionAry.push(cc.callFunc(function () {
                    let xIndex = arguments[1][0]
                    let count = arguments[1][1];
                    let score = this.getAddScoreCal(count);
                    // Utils.showTipsText("+" + score, this.m_n_gamenode, this.m_maparray[xIndex].x, this.m_maparray[xIndex].y, 60);
                    Utils.showHurtText("+" + score, this.m_n_gamenode, this.m_maparray[xIndex].x, this.m_maparray[xIndex].y, 20, null, null, null, true);
                    this.updateScore(score)
                }, this, [xIndex, count]))

                actionAry.push(cc.callFunc(function () {
                    let xIndex = arguments[1]
                    this.m_maparray[xIndex].isHaveFK = null
                    let FKNode = this.m_maparray[xIndex].getChildByName("colorSpr")
                    if (!FKNode) {
                        return //防止没有这个方块的时候
                    }
                    this.attackMonster(FKNode.colorIndex, this.m_maparray[xIndex].x, this.m_maparray[xIndex].y);
                    //这个假方块变大并且渐隐掉
                    FKNode.runAction(cc.sequence(
                        cc.spawn(cc.scaleTo(0.5, 2), cc.fadeOut(0.5)),
                        cc.removeSelf(true)
                    ))

                }, this, xIndex))

                actionAry.push(cc.delayTime(0.1))
                count++
            }
        }

        if (actionAry.length > 0) {
            Utils.SetSoundEffect(window.GET_GOLD, false, 1);
            actionAry.push(cc.callFunc(function () {
                this._isdeleting = false
                this.checkIsLose()
            }, this))
            this.handlerShowTime(clearnum);
            this._isdeleting = true
            let action = cc.sequence(actionAry)
            this.node.runAction(action);
        }
    },

    //获得两个数组的交集
    get2AryIntersect: function (ary1, ary2) {
        let intersectAry = []
        for (let i = 0; i < ary1.length; i++) {
            for (let j = 0; j < ary2.length; j++) {
                if (ary2[j] == ary1[i]) {
                    intersectAry.push(ary2[j])
                }
            }
        }
        return intersectAry
    },


    /**
     * 获得两个数组的交集
     * @param  {array}数组1
     * @param  {array}数组2
     * @return {boolean}是否相交
     */
    check2AryIsEqual: function (ary1, ary2) {
        for (let i = 0; i < ary1.length; i++) {
            if (ary2[i] != ary1[i]) {
                return false
            }
        }
        return true
    },

    handlerShowTime(num) {
        console.log("handlerShowTime", num);
        let index = -1;
        if (num > 9 && num <= 12) {
            index = 0;
        } else if (num > 12 && num <= 15) {
            index = 1;
        } else if (num > 15) {
            index = 2;
        }
        if (index >= 0) {
            if (index == 2) {
                Utils.SetSoundEffect(window.SAY_3, false, 1);
            } else {
                Utils.SetSoundEffect(window.GET_GOLD, false, 1);
            }
            this.m_n_showtime[index].active = true;
            this.m_n_showtime[index].getComponent(cc.Animation).play();
            setTimeout(() => {
                this.m_n_showtime[index].active = false;
            }, 1500);
        }
    },

    //增加金币数
    addGold(gold, spos, epos) {
        let this$1 = this;
        let spritefram = this.m_spf_gold;
        window.INIT_GAME_SAVE_DATA.gold_num += gold;
        for (let i = 0; i < gold; i++) {
            Utils.moveIcon(spritefram, this.m_n_gamenode, spos, epos, () => {
                Utils.SetSoundEffect(window.GET_GOLD, false, 0.4);
                this$1.m_l_gold.string = window.INIT_GAME_SAVE_DATA.gold_num;
            }, 0.5, 60 * (i + 1));
        }
        // })
    },

    //展示宝箱
    showBox(spos, epos, lv) {
        let this$1 = this;
        let callback = function () {
            if (lv % 10 == 0 && lv <= 370) {
                this$1.m_n_stepview.scale = 0;
                this$1.m_n_stepview.active = true;
                this$1.m_n_stepview.runAction(cc.sequence(cc.scaleTo(0.2, 1.2, 1.2).easing(cc.easeIn(3.0)), cc.scaleTo(0.1, 1, 1)));
                this$1.m_n_stepview.getComponent("StepViewItem").showStep(lv);
            }
        }
        Utils.loadRes('sprite/getshare_box', cc.SpriteFrame, (obj) => {
            Utils.moveIcon(obj, this$1.m_n_gamenode, spos, epos, () => {
                this$1.m_n_sharegift.active = true;
                this$1.m_n_sharegift.getComponent('GetBoxGiftItem').showView(callback);
            }, 0.8, 100);
        })
    },

    attackMonster(hurt, x, y) {
        let self = this;
        let realhurt = hurt ? 2 * hurt : 2;
        let blocknode = this.m_block_pool.get();
        if (!blocknode) {
            blocknode = cc.instantiate(this.m_pre_rock);
        }
        let angle = Utils.getAngle(this.m_sp_monster.node.parent.x, this.m_sp_monster.node.parent.y, x, y);
        if (this.m_sp_monster.node.parent.x <= x) {
            angle = -angle;
        }
        blocknode.rotation = angle;
        blocknode.getComponent("RockItem").resetSytem();
        blocknode.setLocalZOrder(1 << 5);
        blocknode.parent = this.m_n_gamenode;
        blocknode.x = x;
        blocknode.y = y;
        blocknode.runAction(cc.sequence(cc.callFunc(() => {
        }), cc.moveTo(1.0, cc.p(this.m_sp_monster.node.parent.x, this.m_sp_monster.node.parent.y)).easing(cc.easeIn(2.0)), cc.callFunc(() => {
            self.m_block_pool.put(blocknode);
            blocknode = null;
            self.monsterbeHit(realhurt);
        })));
    },

    destroyBlockByHitMonster() {
        let self = this;
        let arr = [];
        let len = 4;
        for (let i = 0; i < this.m_maparray.length; i++) {
            if (this.m_maparray[i].isHaveFK) {
                arr.push(i);
                len--;
                if (len <= 0) break;
            }
        }
        for (let i = 0; i < arr.length; i++) {
            let blocknode = this.m_light_pool.get();
            if (!blocknode) {
                blocknode = cc.instantiate(this.m_pre_light);
            }
            let pos = this.m_maparray[arr[i]].position;
            blocknode.parent = this.m_n_gamenode;
            blocknode.position = cc.p(this.m_sp_monster.node.parent.x, this.m_sp_monster.node.parent.y);
            blocknode.runAction(cc.sequence(cc.callFunc(() => {
                Utils.SetSoundEffect(window.GET_GOLD, false, 1);
            }), cc.moveTo(0.8, pos).easing(cc.easeIn(2.0)), cc.callFunc(() => {
                self.m_light_pool.put(blocknode);
                blocknode = null;
                self.blockBeHit(arr[i]);
            })));
        }
    },

    blockBeHit(index) {
        this.m_maparray[index].isHaveFK = null;
        for (let i = 0; i < this.m_n_kuai.length; i++) {
            let shapeitem = this.m_n_kuai[i].getComponent("ShapeItem");
            if (shapeitem.checkIsLose()) {
                this.m_n_kuai[i].opacity = 125;
            } else {
                this.m_n_kuai[i].opacity = 255;
            }
        }
        let FKNode = this.m_maparray[index].getChildByName("colorSpr")
        if (!FKNode) {
            return //防止没有这个方块的时候
        }
        FKNode.runAction(cc.sequence(
            cc.spawn(cc.scaleTo(0.5, 2), cc.fadeOut(0.5)),
            cc.removeSelf(true)
        ));
    },

    monsterbeHit(hurt) {
        Utils.SetSoundEffect(window.BE_HIT, false, 0.3);
        Utils.showHurtText('-' + hurt, this.m_sp_monster.node.parent, 0, 100, 30, new cc.Color(230, 71, 21), 0.8);
        this.updateScore(hurt);
        let hp = this.m_sp_monster.node.getComponent("MonsterItem").reduceHp(hurt);
        if (hp <= 0) {
            this.m_normal_curtime = -1;
            this.judgeGame(true);
        } else {
            this.m_normal_curtime = 0;
            if (this.m_solidernum <= 0 && this.m_cur_attack_num <= 0) {
                this.judgeGame(false);
            } else if (this.m_cur_attack_num <= 0 && hp <= 20) {
                this.m_sp_monster.node.getComponent("MonsterItem").playAngry();
            } else {
                this.m_sp_monster.node.getComponent("MonsterItem").playBeHit();
            }
        }
    },

    onOpenSkinPanel() {
        this.m_n_skinpanel.active = true;
    },



    onCancelVideo() {
        this.m_n_lookvideo.active = false;
        if (this._relivenum <= 0) {
            this.m_n_reliveview.active = true;
            this.m_n_reliveview.scale = 0;
            this.m_n_reliveview.runAction(cc.sequence(cc.scaleTo(0.2, 1.2, 1.2).easing(cc.easeIn(3.0)), cc.scaleTo(0.1, 1, 1)));
            if (window.SKIN_SHARE) {
                this.showAdBanner(false);
                let node = cc.find("btn_close", this.m_n_reliveview);
                node.y = -585;
                this.scheduleOnce(() => {
                    node.y = -514;
                    if (!this.showAdb)
                        this.showAdBanner(true);
                }, 1.3)
            } else {
                this.showAdBanner(true);
            }
        }
        else {
            this.m_n_displaycheck.active = false;
            this.m_n_displayrank.active = true;
            console.log("this._relivenum++", this._relivenum);
            this.m_n_result_panel.getComponent("GameResult").showFail(this._relivenum, this.m_cur_score, this._killnum);
            this.showAdBanner(true);
            RankList.setScore(window.INIT_GAME_SAVE_DATA.top_score);
            Utils.SetSoundEffect(window.CHALLENG_FAIL_MUSIC, false, 1);
        }
        this._relivenum++;
    },

    onAdBtnClick(event, custom) {
        if (typeof (wx) != 'undefined') {
            if (!window.firstvideo && custom == 3) {
                // window.CHANGE_BLOCK = 1;
                // cc.sys.localStorage.setItem('change', '1');
                window.firstvideo = true;
                this.videoReward(1);
                return;
            }
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
            console.log('it is not wechat');
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
            // Utils.showTipsText("error:" + err.errMsg);
        });

        this.m_videoAd.load()
            .then(() => {
                self.m_videoAd.show();
                self.showAdb = true;
                self.m_videoAd.onClose((status) => {
                    self.m_videoAd.offClose();
                    self.showAdb = false;
                    self.showAdBanner(false);
                    if (status && status.isEnded || status === undefined) {
                        self.videoReward(custom);
                    } else {

                    }
                });
            })
            .catch(err => Utils.showTipsText("拉去视频广告失败，请稍候重试", null, null, null, 60, cc.Color.BLACK, 1.2));
    },

    videoReward(custom) {
        if (custom == 1 || custom == 3) {
            let list = this.getCanDropBlocks();
            // console.log('list=',list);
            for (let i = 0; i < this.m_n_kuai.length; i++) {
                let shapeitem = this.m_n_kuai[i].getComponent("ShapeItem");
                this.m_n_kuai[i].opacity = 255;
                shapeitem.resetBlock(list[i] || 0);
            }
            this.m_in_judge = false;
            this.m_n_lookvideo.active = false;
        } else if (custom == 2) {
            this.m_doublescore = 2;
            this.m_n_doublescore.active = true;
            Utils.showTipsText("得分双倍", null, 0, 0, 60);
            this.m_n_luckyvideo.active = false;
        }
    },

    judgeGame(boo) {
        if (this.m_in_judge) return;
        this.m_in_judge = true;

        if (boo) { //胜利
            console.log('胜利');
            this._killnum++;
            let time = this.m_sp_monster.node.getComponent("MonsterItem").playDead();
            Utils.SetSoundEffect(window.CHALLENG_VICTORY_MUSIC, false, 1);
            let gold = 3;
            let pos = this.m_sp_monster.node.parent.position;
            if (this.m_cur_level % 5 == 0) {
                this.showBox(cc.v2(pos.x, pos.y - 100), cc.Vec2.ZERO, this.m_cur_level);
            } else {
                this.addGold(gold, cc.v2(pos.x, pos.y - 10), this.m_l_gold.node.position)
            }

            window.INIT_GAME_SAVE_DATA.top_level += 1;
            let self = this;
            this.scheduleOnce(() => {
                self.onNextLevel();
            }, time / 1000)
            this.destroyBlockByHitMonster();
            RankList.setScore(window.INIT_GAME_SAVE_DATA.top_score);
        } else {
            if (this._videonum <= 0) {
                console.log('失败');
                this.m_sp_monster.node.getComponent("MonsterItem").playMonsterVictory();
                this.m_n_lookvideo.active = true;
                this.m_n_lookvideo.scale = 0;
                this.m_n_lookvideo.runAction(cc.sequence(cc.scaleTo(0.2, 1.2, 1.2).easing(cc.easeIn(3.0)), cc.scaleTo(0.1, 1, 1)));
                if (window.firstvideo) {
                    this.m_l_asktype.string = "看视频换一批";
                } else {
                    this.m_l_asktype.string = "免费换一批";
                    // window.firstvideo = true;
                }
                this._videonum++;
            } else {
                this.onCancelVideo();
            }
        }
    },

    /**
     * @description 宝箱奖励获取处理
     * @author 吴建奋
     * @param {Number} type
     */
    BoxReward(type) {
        if (type == 0) {
            this.updateToolsNum();
        } else {
            this.updateGold();
        }
    },

    onVideoClose() {
        this.m_n_reliveview.active = false;
        this.m_n_displaycheck.active = false;
        this.m_n_displayrank.active = true;
        this.m_n_result_panel.getComponent("GameResult").showFail(this._relivenum, this.m_cur_score, this._killnum);
        this.showAdBanner(true);
        RankList.setScore(window.INIT_GAME_SAVE_DATA.top_score);
        Utils.SetSoundEffect(window.CHALLENG_FAIL_MUSIC, false, 1);
    },

    onReliveBtnClick() {
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
                this.showReliveAd();
            } else {
                VersionToast();
            }
        } else {
            console.log('it is not wechat');
            this.onReliveGameVideo();
        }
    },

    showReliveAd() {
        let self = this;
        if (!this.m_videoAd2) {
            this.m_videoAd2 = wx.createRewardedVideoAd({
                adUnitId: 'adunit-5187ffc3ab571318'
            });
        }
        this.m_videoAd2.onError(err => {
            // Utils.showTipsText("error:" + err.errMsg);
        });

        this.m_videoAd2.load()
            .then(() => {
                self.m_videoAd2.show();
                self.showAdBanner(false);
                self.m_videoAd2.onClose((status) => {
                    self.m_videoAd2.offClose();
                    if (status && status.isEnded || status === undefined) {
                        self.onReliveGameVideo();
                    } else {

                    }
                });
            })
            .catch(err => Utils.showTipsText("视频拉取失败，请稍后重试", null, null, null, 60, cc.Color.BLACK, 1.2));
    },

    onNextLevel() {
        this.m_n_result_panel.active = false;
        this.showAdBanner(false);
        this.m_cur_level = window.INIT_GAME_SAVE_DATA.top_level + 1;
        console.log("this.m_cur", this.m_cur_level);
        this.m_in_judge = false;
        this.m_l_level.string = "LV." + this.m_cur_level;
        this.initMonster(this.m_cur_level);
        this.checkIsLose();
    },

    onBackToMenu() {
        Utils.SetSoundEffect(window.BUTTON_CLICK_MUSIC, false, 1);
        cc.director.loadScene(window.MENU_SCENE_NAME);
    },

    onBoomClick(event) {
        // this.judgeGame(false);
        Utils.SetSoundEffect(window.BUTTON_CLICK_MUSIC, false, 1);
        if (this.m_gamestate == 0 && !this._isdeleting) {
            if (this.m_boomnum <= 0) {
                this.m_n_tooluse.active = true;
                this.m_n_tooluse.getComponent("UseToolItem").initToolInfo(0, this.m_boomnum, this.m_spriteAtlas.getSpriteFrame(window.TOOL_CONFIG[0].name));
            } else {
                this.m_n_guidemask.active = !this.m_mapblink;
                this.m_touch_boom = !this.m_mapblink;
                this.setMapBlink(!this.m_mapblink);
            }
        }
    },

    onStrongClick(event) {
        Utils.SetSoundEffect(window.BUTTON_CLICK_MUSIC, false, 1);
        if (this.m_gamestate == 0) {
            this.m_n_tooluse.active = true;
            this.m_n_tooluse.getComponent("UseToolItem").initToolInfo(1, this.m_strongnum, this.m_spriteAtlas.getSpriteFrame(window.TOOL_CONFIG[1].name));
            this.guideMaskClick();
        }
    },

    onUseStrong() {
        let t = false;
        for (let i = 0; i < this.m_row; i++) {
            for (let j = 0; j < this.m_col; j++) {
                if (this.m_grid_array[i][j].type == 1) {
                    let a = this.m_grid_array[i][j].obj.getComponent("BlockItem").addStrong();
                    if (a) {
                        t = true;
                    }
                }
            }
        }
        if (t) {
            window.INIT_GAME_SAVE_DATA.tool[1] -= 1;
            this.updateToolsNum();
        }
    },

    //设置背景闪烁
    setMapBlink(boo) {
        if (boo === this.m_mapblink) {
            return;
        }

        this.m_mapblink = boo;
        if (boo) {
            for (let i = 0; i < this.m_maparray.length; i++) {
                if (!this.m_maparray[i].isHaveFK) {
                    let action = cc.repeatForever(cc.sequence(cc.scaleTo(0.8, 0.8, 0.8), cc.scaleTo(0.8, 1, 1)));
                    action.setTag(1);
                    this.m_maparray[i].runAction(action);
                }
            }
        } else {
            for (let i = 0; i < this.m_maparray.length; i++) {
                if (!this.m_maparray[i].isHaveFK) {
                    this.m_maparray[i].stopActionByTag(1);
                    this.m_maparray[i].scale = 1;
                }
            }
        }
    },

    getTargetGridInfo(target) {
        let i = Math.floor(target / this.m_row);
        let j = target % this.m_col;
        return this.m_maparray[i][j];
    },

    onReliveGameVideo() {
        Utils.showTipsText("复活成功");
        this.m_in_judge = false;
        for (let i = 0; i < this.m_n_kuai.length; i++) {
            this.m_n_kuai[i].getComponent("ShapeItem").resetBlock();
            this.m_n_kuai[i].opacity = 255;
        }
        this.m_sp_monster.node.getComponent("MonsterItem").playAngry();
        this.m_n_result_panel.active = false;
        this.m_n_reliveview.active = false;
        this.m_maparray.forEach(element => {
            element.getChildByName("colorSpr")
        });
        for (let index = 0; index < this.m_maparray.length; index++) {
            let FKNode = this.m_maparray[index].getChildByName("colorSpr")
            //这个假方块变大并且渐隐掉
            if (FKNode) {
                FKNode.runAction(cc.sequence(
                    cc.spawn(cc.scaleTo(0.5, 2), cc.fadeOut(0.5)),
                    cc.removeSelf(true)
                ));
            }
            this.m_maparray[index].isHaveFK = null;
        }

        RankList.checkWillSurpass(this.m_cur_score);
        this.m_n_displaycheck.active = true;
        this.m_n_displayrank.active = false;
        this.m_gamestate = 0;
    },

    onReliveGame() {
        Utils.SetSoundEffect(window.BUTTON_CLICK_MUSIC, false, 1);
        if (window.INIT_GAME_SAVE_DATA.gold_num >= 20) {
            Utils.showTipsText("复活成功");
            this.m_in_judge = false;
            window.INIT_GAME_SAVE_DATA.gold_num -= 20;
            this.updateGold();
            for (let i = 0; i < this.m_n_kuai.length; i++) {
                this.m_n_kuai[i].getComponent("ShapeItem").resetBlock(0);
                this.m_n_kuai[i].opacity = 255;
            }
            this.m_sp_monster.node.getComponent("MonsterItem").playAngry();
            this.m_n_result_panel.active = false;
            RankList.checkWillSurpass(this.m_cur_score);
            this.m_n_displaycheck.active = true;
            this.m_n_displayrank.active = false;
            this.m_gamestate = 0;
        } else {
            // Utils.showTipsText("金币不足")
            ShareSdk.shareAppMessage({
                title: "来帮帮我，我被怪兽消灭了",
                imageUrl: window.tempFileURL[1],
                success: res => {

                },
                fail: err => {

                },
                complate: msg => {

                },
            });
        }
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
        if (this.m_bannerad) {
            this.m_bannerad.destroy();
            this.m_bannerad = null;
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
                    // console.log('banner 广告加载成功')

                })
                self.m_bannerad.show().then(() => {
                    // console.log("广告显示成功");
                }).catch((err) => {
                    // console.error("广告加载失败", err);
                })
                self.m_bannerad.onError(err => {
                    // console.error(err)
                })

            }
        }
    },

    onOpenAskPanel() {
        this.m_n_askpanel.active = true;
    },

    onCloseAskPanel() {
        this.m_n_askpanel.active = false;
    },

    update(dt) {
        if (this.m_normal_curtime != -1) {
            this.m_normal_curtime += dt;
            if (this.m_normal_curtime >= this.m_normal_talktime && this.m_gamestate == 0) {
                this.m_normal_curtime = 0;
                this.m_sp_monster.node.getComponent("MonsterItem").playNormal();
            }
        }
    },
});