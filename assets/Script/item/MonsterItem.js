// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var Utils = require("Utils");
cc.Class({
    extends: cc.Component,

    properties: {
        _mon_id: 0,
        _hp: 0,
        m_n_talk: cc.Node,
        m_l_talk: cc.Label,
        m_n_bloodmask: cc.Node,
        m_sp_blood: cc.Node,
        m_l_blood: cc.Label,
        m_n_behit: cc.Node,
        m_n_stand: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        // this.m_n_talk.active = false;
    },

    initType(monsterid, hp, level) {
        this._mon_id = monsterid;
        this._hp = hp;
        this._all_hp = hp;
        this.m_l_blood.string = this._hp;
        this.m_n_bloodmask.width = this.m_sp_blood.width;
        this._noangry = true;
        this.node.getComponent(cc.Animation).play("monster" + this._mon_id + "stand");
        if (typeof (window.MONSTER_CONFIG[monsterid]) != "undefined") {
            this.node.scale = window.MONSTER_CONFIG[monsterid].scale;
            if (level % 5 == 0) {
                this.node.scale = window.MONSTER_CONFIG[monsterid].scale + 0.8;
            }
            this.m_n_bloodmask.parent.y = window.MONSTER_CONFIG[monsterid].bloodheight + 10;
            // console.log(this.m_n_bloodmask.parent.y);
        }
    },

    reduceHp(hp) {
        this._hp -= hp;
        if (this._hp < 0) this._hp = 0;
        this.m_l_blood.string = this._hp;
        this.m_n_bloodmask.width = this._hp / this._all_hp * this.m_sp_blood.width;
        return this._hp;
    },

    addHp(hp) {
        this._hp += hp;
        if (this._hp > this._all_hp) {
            this._all_hp = this._hp;
        }
        this.m_l_blood.string = this._hp;
        this.m_n_bloodmask.width = this._hp / this._all_hp * this.m_sp_blood.width;
        return this._hp;
    },

    playBeHitEffect() {
        this.m_n_behit.getComponent(cc.Animation).play("behit_effect");
    },

    playBeHit() {
        this.node.getComponent(cc.Animation).play("monster" + this._mon_id + "hit");
        this.playBeHitEffect();
    },

    playBeHapply() {
        let suff = "move";
        if (this._mon_id == 0) {
            suff = "stand";
        }
        this.node.getComponent(cc.Animation).play("monster" + this._mon_id + suff);
    },

    beHitFinish() {
        this.node.getComponent(cc.Animation).play("monster" + this._mon_id + "stand");
    },

    playNormal() {
        this.talkNormal();
    },

    playAttack() {
        this.playBeHapply();
        this.talkAttack();
    },

    playDead() {
        this.node.runAction(cc.fadeOut(3.0));
        this.m_n_stand.runAction(cc.fadeOut(3.0));
        this.schedule(function () {
            // 这里的 this 指向 component
            this.playBeHit();
        }, 0.3, 2, 0);
        this.talkFail();
        return 3000;
    },

    playStartTalk() {
        this.playBeHapply();
        this.talkStart();
        this.m_n_stand.opacity = 100;
    },

    playMonsterVictory() {
        this.playBeHapply();
        this.talkVictory();
    },

    playHappyTalk() {
        this.talkHappy();
        this.playBeHapply();
    },

    playAngry() {
        if (this._noangry) {
            this.talkAngry();
            this._noangry = false;
        }
    },

    talkHappy(id) {
        if (window.MONSTER_CONFIG[this._mon_id]) {
            this.m_n_talk.active = true;
            if (typeof (id) != 'number') {
                id = Utils.random(0, window.MONSTER_CONFIG[this._mon_id].happy_talk.length);
            }
            let talktext = window.MONSTER_CONFIG[this._mon_id].happy_talk[id];
            this.m_l_talk.string = talktext;
            this.m_n_talk.getComponent(cc.Animation).play('bubbleanim');
        }
    },

    talkStart(id) {
        // console.log("talkStart", id, this._mon_id);
        if (window.MONSTER_CONFIG[this._mon_id]) {
            this.m_n_talk.active = true;
            if (typeof (id) != 'number') {
                id = Utils.random(0, window.MONSTER_CONFIG[this._mon_id].start_talk.length);
            }
            let talktext = window.MONSTER_CONFIG[this._mon_id].start_talk[id];
            // console.log("talktext", talktext);
            this.m_l_talk.string = talktext;
            this.m_n_talk.getComponent(cc.Animation).play('bubbleanim');
        }
    },

    talkAngry(id) {
        if (window.MONSTER_CONFIG[this._mon_id]) {
            this.m_n_talk.active = true;
            if (typeof (id) != 'number') {
                id = Utils.random(0, window.MONSTER_CONFIG[this._mon_id].angry_talk.length);
            }
            let talktext = window.MONSTER_CONFIG[this._mon_id].angry_talk[id];
            this.m_l_talk.string = talktext;
            this.m_n_talk.getComponent(cc.Animation).play('bubbleanim');
        }
    },

    talkFail(id) {
        if (window.MONSTER_CONFIG[this._mon_id]) {
            this.m_n_talk.active = true;
            if (typeof (id) != 'number') {
                id = Utils.random(0, window.MONSTER_CONFIG[this._mon_id].fail_talk.length);
            }
            let talktext = window.MONSTER_CONFIG[this._mon_id].fail_talk[id];
            this.m_l_talk.string = talktext;
            this.m_n_talk.getComponent(cc.Animation).play('bubbleanim');
        }
    },

    talkVictory(id) {
        if (window.MONSTER_CONFIG[this._mon_id]) {
            this.m_n_talk.active = true;
            if (typeof (id) != 'number') {
                id = Utils.random(0, window.MONSTER_CONFIG[this._mon_id].victoy_talk.length);
            }
            let talktext = window.MONSTER_CONFIG[this._mon_id].victoy_talk[id];
            this.m_l_talk.string = talktext;
            this.m_n_talk.getComponent(cc.Animation).play('bubbleanim');
        }
    },

    talkNormal(id) {
        if (window.MONSTER_CONFIG[this._mon_id]) {
            this.m_n_talk.active = true;
            if (typeof (id) != 'number') {
                id = Utils.random(0, window.MONSTER_CONFIG[this._mon_id].normal_talk.length);
            }
            let talktext = window.MONSTER_CONFIG[this._mon_id].normal_talk[id];
            this.m_l_talk.string = talktext;
            this.m_n_talk.getComponent(cc.Animation).play('bubbleanim');
        }
    },

    talkAttack(id) {
        if (window.MONSTER_CONFIG[this._mon_id]) {
            this.m_n_talk.active = true;
            if (typeof (id) != 'number') {
                id = Utils.random(0, window.MONSTER_CONFIG[this._mon_id].attack_talk.length);
            }
            let talktext = window.MONSTER_CONFIG[this._mon_id].attack_talk[id];
            this.m_l_talk.string = talktext;
            this.m_n_talk.getComponent(cc.Animation).play('bubbleanim');
        }
    },
    // update (dt) {},
});
