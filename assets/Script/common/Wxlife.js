import EventListener from './event_listener';
// import data from '../dataStatistics/Data';
var Utils = require("Utils");
window.EVENT_LISTENER = EventListener({});
let wxIsBackGround = false;
window.firstGame = true;
window.firststart = false;
window.getdata = false;
window.need_add = false;
window.firstshare = false;
window.firstvideo = false;
let time = 0;
cc.view.enableRetina(true);
if (typeof (wx) != "undefined") {
    wx.onHide(() => {
        // console.log("==========wx HIDE==============");
        wxIsBackGround = true;
        if (window.getdata) {
            Utils.setSaveData();
        }
        time = new Date().getTime();
    });

    wx.onShow((res) => {
        // console.log("==========wx SHOW==============");
        if (!wxIsBackGround) {

        } else {//其他时间隐藏显示更新界
            Utils.resumBgmMusic();
            let endtime = new Date().getTime();
            EVENT_LISTENER.fire(window.ON_SHOW_BACK, endtime - time);
        }

        if (res.query.group) {
            window.SHOW_RES = res;
            EVENT_LISTENER.fire(window.GAME_RANK_LISTENER);
        }
    });
}