
cc.Class({
    extends: cc.Component,

    properties: {
        m_partice: cc.ParticleSystem,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    resetSytem(){
        this.m_partice.resetSystem();
    }
    // update (dt) {},
});
