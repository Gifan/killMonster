
export default class Common_CommonUtil {

    static isWeChat(): boolean {
        return cc.sys.platform == cc.sys.WECHAT_GAME;
    }

    static showTips(content, hideCallback) {
        cc.loader.loadRes("common/prefabs/h5game_Tips", (err, prefab) => {
            if (err) {
                cc.error(err);
                return;
            }
            var obj = cc.instantiate(prefab);
            obj.getComponent("h5game_Tips").setText(content, hideCallback);
            obj.parent = cc.director.getScene();
            //obj.position = cc.p(0,0);
        });
    }

    static showShareFailTips() {
        Common_CommonUtil.getPrefab("prefabs/n_sharebubble", (obj) => {
            obj.parent = cc.find("Canvas") || cc.director.getScene().children[0];
            obj.zIndex = 1 << 11;
        })
    }
    
    static shakeScreen(targetNode, deltaTime: number = 0.02, offset: number = 10) {
        var camera = targetNode;
        camera.stopAllActions();
        //camera.position = cc.Vec2.ZERO;
        camera.runAction(
            cc.sequence(
                cc.moveBy(deltaTime, cc.p(offset * 2, 0)),
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
            )
        )
    }

    static fitScreen() {
        var canvas = cc.director.getScene().getComponentInChildren(cc.Canvas);
        var screenSize = cc.view.getVisibleSize();
        if (screenSize.width / screenSize.height < 9 / 16) {
            canvas.fitWidth = true;
            canvas.fitHeight = false;
        }
        else {
            canvas.fitWidth = false;
            canvas.fitHeight = true;
        }
    }

    public static resetScale(targetNode: cc.Node) {
        var screenSize = cc.view.getVisibleSize();
        if (screenSize.width / screenSize.height < 9 / 16) {
            targetNode.scale = screenSize.width / 1080;//适配宽度
        }
        else {
            targetNode.scale = screenSize.height / 1920;//适配高度
        }
    }


    /**
     * 显示广告(传入当前游戏名称，便于统计分类)
     */
    static showAD: (gameName) => {

    }

    static imgStr(str) {
        return str;
    }

    static txtStr(str) {
        return str;
    }

    //获取启动参数
    static getLaunchParams() {
        let parseParams = (str) => {
            if (!str)
                return null;
            str = str.substr(1);
            let params = {};
            let arr = str.split("&");
            for (let i = 0; i < arr.length; i++) {
                let kv = arr[i].split("=");
                params[kv[0]] = kv[1];
            }
            if (params.token && params.userId && params.gameId && params.serverHost)
                return params;
            else
                return null;
        };

        if (cc.sys.isNative) {//内生平台
            return null;
        }
        else if (Common_CommonUtil.isWeChat()) {//微信平台
            let params = wx.getLaunchOptionsSync().query;
            if (params.token && params.userId && params.gameId && params.serverHost)
                return params;
            return null;
        }
        else//h5通过url获取
        {
            let url = window.location.href;
            var paramStr = null;
            let startIndex = url.lastIndexOf("?");
            if (startIndex >= 0)
                paramStr = url.substring(startIndex);
            return parseParams(paramStr);
        }
    }

    static preview() {
        if (!Common_CommonUtil.isWeChat())
            return;
        wx.previewImage({
            urls: ["https://h5gameres.kuaiyugo.com/chatgame/cocos_games_res/images/codeImage.jpg"]
        });
    }

    /**
    * 为节点或sprite设置SpriteFrame
    * @param {string|cc.Node|cc.Sprite} obj node，sprite或其路径
    * @param {string } imageUrl 资源路径
    */
    static setSprite(obj, imageUrl: string = "", callback: Function = null) {
        if (!obj)
            throw new Error("请传入正确的节点名称");
        if (!imageUrl)
            throw new Error("请传入正确的资源路径");
        var spr;
        if (obj instanceof cc.Sprite)                       //参数为Sprite
            spr = obj;
        else if (obj instanceof cc.Node)                    //参数为Node
            spr = obj.getComponent(cc.Sprite);
        else if (Object.prototype.toString.call(obj) === "[object String]")//参数为string(sprite所在Node的路径)
            spr = cc.find(obj).getComponent(cc.Sprite);
        else
            throw new Error("传入节点资源类型不正确");
        if (!spr)
            throw new Error("未找到正确的Sprite");
        if (!spr || !spr.spriteFrame)
            return;
        var opacity = spr.node.opacity;
        spr.node.opacity = 0;
        // cc.loader.loadRes(imageUrl, function (err, obj) {
        //     if (err) {
        //         cc.error(err.message || err);
        //         return;
        //     }
        //     spr.spriteFrame = new cc.SpriteFrame(obj);
        //     spr.node.opacity = opacity;
        // });

        let methodName = "load";
        if (imageUrl.indexOf("http") != 0)
            methodName += "Res";
        cc.loader[methodName](imageUrl, function (err, obj) {
            if (err) {
                cc.error(err.message || err);
                return;
            }
            spr.spriteFrame = new cc.SpriteFrame(obj);
            spr.node.opacity = opacity;
            if (callback)
                callback();
        });
    }

    public static getPrefab(url: string, callback: Function) {
        cc.loader.loadRes(url, (err, prefab) => {
            if (err)
                throw err;
            callback(cc.instantiate(prefab));
        })
    }

    public static setAvatarSprite(spriteOrNode, imgUrl) {
        let sprite = null;
        if (spriteOrNode instanceof cc.Sprite)
            sprite = spriteOrNode;
        else if (spriteOrNode instanceof cc.Node)
            sprite = spriteOrNode.getComponent(cc.Sprite);

        if (!sprite)
            throw new Error("CommonUtil.setSprite:  无法找到正确的Sprite");

        let image = wx.createImage();
        image.onload = function () {
            let texture = new cc.Texture2D();
            texture.initWithElement(image);
            texture.handleLoadedTexture();
            sprite.spriteFrame = new cc.SpriteFrame(texture);
        };
        image.src = imgUrl;
    }
}
