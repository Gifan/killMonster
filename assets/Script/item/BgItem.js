
cc.Class({
    extends: cc.Component,

    properties: {
        m_n_bgday: cc.Node,
        m_n_bgnight: cc.Node,
    },


    start() {
        var myDate = new Date();//获取系统当前时间
        let hours = myDate.getHours();
        this.m_n_bgday.active = hours >= 8 && hours <= 18;
        this.m_n_bgnight.active = hours < 8 || hours > 18;
    },

    // update (dt) {},
});
