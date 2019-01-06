

let netErrorToast = () => {
    wx.showToast({
        title: "联网超时",
        icon: "none",
        image: "",
        duration: 0,
    });
    setTimeout(() => wx.hideToast(), 2000);
};

//被动转发（点击右上角转发菜单） 请勿重复注册回调事件，如不需要转发，请调用wx.hideShareMenu();


module.exports = {

    //onShow时调用 上报统计数据 
    onShow(info, _success, _fail) {
        // dataStatistics.onShowInfo(info, _success, _fail);
    },

    //onHide时调用 上报统计数据
    onHide() {
        // dataStatistics.onHideInfo();
    },

    /**
     * 主动转发
     * @param {EChannelPrefix} channelPrefix    分享渠道
     * @param {string} query                     onShow参数列表
     * @param {Function} netError               联网失败回调方法
     * @param {Function} success                分享成功回调 
     * @param {Function} fail                   分享失败回调 
     * @param {Function} complete               分享完成回调
     */
    share(channelPrefix, query, netError, success, fail, complete, titlePrefix) {
        // dataStatistics.getShareInfo(channelPrefix, (res) => {
        //     console.log("获取分享数据成功：", res);
        //     dataStatistics.shareAppMsg({
        //         title: (titlePrefix || "") + res.data.data.title,
        //         imageUrl: res.data.data.image,
        //         query: query || "",
        //         success: (res) => {
        //             dataStatistics.shareSuccess(EChannelPrefix.invitation);
        //             if (success)
        //                 success(res);
        //         },
        //         fail: fail || null,
        //         complete: complete || null
        //     });
        // }, () => {
        //     netErrorToast();
        //     if (netError)
        //         netError();
        // });
    },

    //分享成绩
    shareScore(score, query, netError, success, fail, complete) {
        // this.share(EChannelPrefix.result, query, netError, success, fail, complete, "我的分数：" + score);
    },

    setData(value, success, fail) {
        // dataStatistics.setKVUserData(value, res => {
        //     //console.log("========保存数据成功：",res);
        //     if (success)
        //         success(res);
        // }, res => {
        //     console.log("========保存数据失败：", res);
        //     if (fail)
        //         fail(res);
        // });
    },

    getData(success, fail) {
        // dataStatistics.getKVUserData(res => {
        //     //console.log("========获取数据成功：",res);
        //     if (success)
        //         success(res);
        // }, err => {
        //     console.log("========获取数据失败：", err);
        //     if (fail)
        //         fail(err);
        // });
    },

    getGameConfigByAppkey(_success, _fail) {
        // dataStatistics.getGameConfigByAppkey(_success, _fail);
    },
}