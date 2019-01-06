import data from "../dataStatistics/Data";
let isWeChat = (cc.sys.platform == cc.sys.WECHAT_GAME);
var ShareSdk = {

    /**
     * desc:    设置设置页面是否显示分享按钮
     * param:   boo- true or false
     *          withShareTicket-是否使用带 shareTicket 的转发
     */

    setShareMenuEnabled(boo, withShareTicket) {
        if (isWeChat) {
            let withShare = withShareTicket ? true : false;
            if (boo) {
                wx.showShareMenu({
                    withShareTicket: withShare,
                });
            }
            else {
                wx.hideShareMenu({
                });
            }
        } else {
            // console.log("it's not wechat platform. setShareMenuEnabled faied!");
        }
    },

    /**
     * desc:    开启监听设置页面分享按钮
     * param:   
        * ShareOption-分享监听参数对象
        *  title		转发标题，不传则默认使用当前小游戏的昵称。	
        *   imageUrl	转发显示图片的链接，可以是网络图片路径或本地图片文件路径或相对代码包根目录的图片文件路径。	
        *   query		查询字符串，必须是 key1=val1&key2=val2 的格式。从这条转发消息进入后，可通过 wx.onLaunch() 或 wx.onShow 获取启动参数中的 query。	
        *   success		转发成功的回调函数	
        *   fail		转发失败的回调函数	
        *   complete	转发完成的回调函数
     */

    onShareAppMessage(object) {
        if (isWeChat) {
            wx.onShareAppMessage(object);
        } else {
            // console.log("it's not wechat platform. onShareAppMessage faied!");
        }
    },

    /**
     * desc:    转发分享
     * param:   
        * ShareOption-分享监听参数对象
        *  title		转发标题，不传则默认使用当前小游戏的昵称。	
        *   imageUrl	转发显示图片的链接，可以是网络图片路径或本地图片文件路径或相对代码包根目录的图片文件路径。	
        *   query		查询字符串，必须是 key1=val1&key2=val2 的格式。从这条转发消息进入后，可通过 wx.onLaunch() 或 wx.onShow 获取启动参数中的 query。	
        *   success(res)		转发成功的回调函数	res.shareTickets[0]成功转发参数
        *   fail		转发失败的回调函数	
        *   complete	转发完成的回调函数
     */

    shareAppMessage(object) {
        if (isWeChat) {
            if (typeof (object) != "object") { console.log("param 'object' is not a js object "); return; }
            if (typeof (object.title) == "undefined") { console.log("param 'object' property title is undefined!"); return; }
            // wx.showShareMenu({
            //     withShareTicket: true,
            // });
            wx.shareAppMessage(object);
        } else {
            // console.log("it's not wechat platform. onShareAppMessage faied!");
        }
    },

    /**
     * desc：   接入复活分享界面--需要配置参数config.js window.RELIVE_COST_PIC_PATH
     * param：  prefabs-复活界面预制体 object-回调参数对象{shareObj:{}, onSkipCallBack:function, onCostRelive:function, score: string, cost_num:number}
     *          parentNode-复活分享界面的父节点，空则以场景画布为父节点
     * @param onCostRelive 需要有返回值是否成功复活
     */
    openReliveView(prefabs, obj, parentNode) {
        var node = cc.instantiate(prefabs);
        if (parentNode != null && cc.isValid(parentNode)) {
            node.parent = parentNode;
        } else {
            parentNode = cc.find("Canvas");
            node.parent = parentNode;
        }
        var compon = node.getComponent("ReliveViewCtrl");
        compon.setCallBackObj(obj);
        if (obj.cost_num) {
            compon.setCostNumLabel(obj.cost_num);
        }
        compon.setScoreLabel(obj.score);
        compon.ShowView(true);
        // compon.CountDownClick(10);
    },

    /**
     * desc：   分享成绩
     * param：  score-成绩   title-分享的文案   url-分享的图片路径
     * example: shareScoreMessage(10, "haha", "");
     */
    shareScoreMessage(score, title, url) {
        if (isWeChat) {
            // var shareCanvas = wx.createCanvas();
            // shareCanvas.width = 668;
            // shareCanvas.height = 501;
            // var context = shareCanvas.getContext('2d');
            // context.font = "bold 200px Verdana"; //粗体字
            // context.fillStyle = "Black";
            // context.textAlign = "center";
            // context.clearRect(0, 0, shareCanvas.width, shareCanvas.height);
            var self = this;
            var scoreNum = score + "";
            // var shareImg = wx.createImage();
            // shareImg.src = cc.url.raw(url);
            var shareTitle = title ? title : "本局得了" + scoreNum + "分，没有办法，我就是这么强大！";
            // shareImg.onload = function () {
            // context.drawImage(shareImg, 0, 0, shareCanvas.width, shareCanvas.height);
            // let timeid = setTimeout(() => {
            // let path = shareCanvas.toTempFilePathSysc();
            wx.shareAppMessage({ title: shareTitle, imageUrl: cc.url.raw(url), });
            // clearTimeout(timeid);
            // }, 0.2);
            // };
        } else {
            // console.log("it's not wechat platform. shareScoreMessage faied!");
        }
    },

    /**
     * desc: 添加二维码更多游戏界面
     * param： prefabs-二维码更多游戏界面预制体 parentNode-父节点，默认画布节点 x,y坐标
     */

    addRqCodeView(prefabs, parentNode, x, y) {
        if (true || isWeChat) {
            let posx = x ? x : 0;
            let posy = y ? y : 0;
            var node = cc.instantiate(prefabs);
            if (parentNode != null && cc.isValid(parentNode)) {
                node.parent = parentNode;
            } else {
                parentNode = cc.find("Canvas");
                node.parent = parentNode;
            }
            node.setPosition(posx, posy);
        }
        else {
            // console.log("it's not wechat platform. addRqCodeView faied!");
        };
    },

    /**
     * desc:    显示最近排行榜信息
     * param:   parentNode-父节点  ranktype-排行榜类型, object-回调对象
     *  
     */
    showFriendRankView(parentNode, ranktype, object) {

    },

    /**
     * 
     * @param parentNode {*父节点}
     * @param ranktype {*群排行榜类型，默认1，暂时只有1}
     * @param object {*回调对象} 
     */
    showGroupRankView(parentNode, ranktype, object) {

    },
};

module.exports = ShareSdk;
