

module.exports = {


    /**
     * 
     * @param {int} _score 设置游戏分数
     * @param {*} success  成功回调
     * @param {*} fail     失败回调
     * @param {*} complete 完成回调
     */
    setScore(_score, success, fail, complete) {
        if (typeof (wx) != "undefined") {
            // console.log("_score=",_score);
            wx.setUserCloudStorage({
                KVDataList: [{ key: "score", value: _score + "" }],
                success: success || null,
                fail: fail || null,
                complete: complete || null,
            });
            // console.log("set score== end");
        }
    },

    /**
     * 显示好友排行榜
     */
    showFriendList() {
        if (typeof (wx) != "undefined") {
            wx.postMessage({
                rankType: 1,
            })
        }
    },

    /**
     * 显示群排行
     * @param {string} shareTicket 群排行分享许可证
     */
    showGroupList(shareTicket) {
        if (typeof (wx) != "undefined") {
            wx.postMessage({
                shareTicket: shareTicket,
                rankType: 0,
            })
        }
    },

    /**
     * 游戏结束排行
     */
    showGameResultList() {
        if (typeof (wx) != "undefined") {
            wx.postMessage({
                rankType: 2,
            })
        }
    },

    /**
     * 检查是否超越好友 并显示
     * @param {int} score 当前分数
     * @param {Number} x  显示位置pos.x
     * @param {Number} y  显示位置pos.y
     */
    checkSurpassFriend(score, x, y) {
        if (typeof (wx) != "undefined") {
            wx.postMessage({
                rankType: 3,
                score: score,
                x: x || 0,
                y: y || 0
            });
        }
    },


    checkWillSurpass(score, y) {
        if (typeof (wx) != "undefined") {
            wx.postMessage({
                rankType: 4,
                score: score,
                y: y || 500
            });
        }
    }
}