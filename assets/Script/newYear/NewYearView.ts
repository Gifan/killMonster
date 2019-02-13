

const { ccclass, property } = cc._decorator;
declare let wx: any;
declare let canvas: any;
declare let window: any;
@ccclass
export default class NewYearView extends cc.Component {

    @property(cc.Node)
    bgblack: cc.Node = null;

    @property(cc.ParticleSystem)
    gold: cc.ParticleSystem = null;

    @property(cc.Node)
    clickBtn: cc.Node = null;

    @property(cc.Node)
    shareBtn: cc.Node = null;

    @property(cc.Node)
    closeBtn: cc.Node = null;

    @property(cc.Node)
    closeBtnTwo: cc.Node = null;

    @property(cc.AudioSource)
    clickEffect: cc.AudioSource = null;

    @property(cc.AudioSource)
    openEffect: cc.AudioSource = null;

    @property(cc.SpriteAtlas)
    ziti: cc.SpriteAtlas = null;

    @property(cc.Sprite)
    luckyText: cc.Sprite = null;

    @property(cc.Node)
    pitcure: cc.Node = null;

    @property(cc.Label)
    text: cc.Label = null;

    @property(cc.Node)
    bgblack1: cc.Node = null;
    @property(cc.Node)
    guang: cc.Node = null;

    private _allClickNum: number = 0;
    private effectPool: cc.NodePool = null;
    start() {
        this.node.getComponent(cc.Animation).play("1");
        this.scheduleOnce(() => {
            this.clickBtn.active = true;
            this.clickBtn.scaleX = 0.8;
            this.clickBtn.scaleY = 1.1;
            this.clickBtn.runAction(cc.sequence(cc.scaleTo(0.2, 1.1, 0.9), cc.scaleTo(0.1, 0.9, 1.05), cc.scaleTo(0.2, 1, 1)));
        }, 0.50);
        this.bgblack.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);          //点击触摸事件出现点击效果
        this._allClickNum = 7 + Math.floor(Math.random() * 5);
        this.effectPool = new cc.NodePool();
        this.bannerAlign({ top: 90 });
        let num = 1 + Math.floor(Math.random() * 15);
        this.luckyText.spriteFrame = this.ziti.getSpriteFrame(`zi${num}`);
        if (window.GAME_MENU) {
            window.GAME_MENU.showAdBanner(false);
        }
        this.text.string = `连续点击按钮打开祝福吧(${0}/${this._allClickNum + 3})`;
    }

    finishStart() {
        this.node.getComponent(cc.Animation).play("2");
    }

    // update (dt) {}
    touchEnd(event: cc.Event.EventTouch) {
        event.stopPropagation();
        let delta = event.getLocation();
        delta = this.node.convertToNodeSpaceAR(delta);
        this.playClickEffect(delta);
    }

    public playClickEffect(pos: cc.Vec2) {
        let node = this.effectPool.get();
        if (!node) {
            node = cc.instantiate(this.gold.node);
        }
        node.getComponent(cc.ParticleSystem).resetSystem();
        node.getComponent(cc.ParticleSystem).playOnLoad = true;
        node.position = pos;
        node.parent = this.node;
        this.clickEffect.play();
        this.recycleClickEffect(node);
    }
    public recycleClickEffect(node: cc.Node) {
        let time = node.getComponent(cc.ParticleSystem).life;
        this.scheduleOnce(() => {
            this.effectPool.put(node);
        }, time)
    }

    private _clickNum: number = 0;
    public onClickLucky(event, custom) {
        let text = [
            "连续点击打开!",
            "对对对!继续点!",
            "连续点击!加油!",
            "点点点点点!",
            "很厉害!继续点击打开!"
        ]
        let num = Math.floor(Math.random() * 4);
        this._clickNum++;
        this.playClickEffect(event.target.position);
        this.text.string = `${text[num]}(${this._clickNum}/${this._allClickNum + 3})`;
        this.text.node.parent.stopAllActions();
        this.text.node.parent.scale = 1;
        this.text.node.parent.runAction(cc.sequence(cc.scaleTo(0.25, 1.2, 1.2), cc.scaleTo(0.25, 1, 1)));
        if (this._clickNum >= this._allClickNum) {
            this._clickNum = 0;
            if (window.GAME_MENU) {
                window.GAME_MENU.showAdBanner(true);
            }
            this.bgblack1.active = true;
            this.guang.active = true;
            this.node.getComponent(cc.Animation).play("3");
            this.openEffect.play();
        }
    }

    bannerAlign(style) {
        console.error("bannerAlign");
        if (style && typeof (wx) != "undefined") {
            let system = wx.getSystemInfoSync();
            let Size = cc.director.getWinSize();
            let Widthnode = cc.find("Canvas/n_funnymap/n_bannerpos");
            var pos = window.GAME_MENU.node.convertToWorldSpace(Widthnode);

            if (Size.height / Size.width > 2) {//适配全面屏 适用于FIXHeight
                pos.y += (Size.height - 1920) / 2;
            }

            let adaptScaleH = system.screenHeight / Size.height;
            var PosY = ((Size.height - pos.y) * adaptScaleH);

            let realheight = Size.height;//改成fixheight
            let y = (realheight - PosY / (system.screenHeight / realheight));
            y = (y - realheight / 2.0);
            this.clickBtn.y = y - 100;
            this.shareBtn.y = y - 100;
            this.closeBtn.y = y - 100;
            this.text.node.parent.y = y + 100;
            this.closeBtnTwo.y = y;
        } else {
            this.clickBtn.y = -707;
            this.shareBtn.y = -707;
            this.closeBtn.y = -707;
            this.text.node.parent.y = -496;
        }
    }

    onClose() {
        this.effectPool.clear();
        this.node.destroy();
        if (window.GAME_MENU) {
            window.GAME_MENU.showAdBanner(true);
            window.GAME_MENU.playmuisc();
        }
    }

    onConfirm() {
        if (window.GAME_MENU) {
            window.GAME_MENU.showAdBanner(false);
        }
        this.closeBtnTwo.active = false;
        this.shareBtn.active = true;
        this.closeBtn.active = true;
        this.bgblack1.active = false;
        this.guang.active = false;
    }


    onShare() {//分享截图中间的没测试过，寄几用寄几的截图
        this.printScreen(this.pitcure).then(res => {
            wx.shareAppMessage({
                title: "新春送祝福，《消除怪兽》陪您过大年！",
                imageUrl: res.tempFilePath,
            });
        }).catch(err => {
            wx.shareAppMessage({
                title: "新春送祝福，《消除怪兽》陪您过大年！",
                imageUrl: window.tempFileURL[1],
            });
        })
    }

    //截图分享
    public printScreen(startnode): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!startnode) {
                console.error("截图的节点不能为空");
            }
            let Size = cc.director.getWinSize();
            console.log("=======Size.height==========", Size);
            let Widthnode = startnode;
            //截图组合分数的分享图
            let adaptScaleW = canvas.width / Size.width;
            let adaptScaleH = canvas.height / Size.height;
            var PosY = ((Size.height / 2 - Widthnode.height / 2) * adaptScaleH);
            console.log("PosY = ", PosY);
            canvas.toTempFilePath({
                x: 0,
                y: PosY,
                width: Widthnode.width * adaptScaleW,
                height: Widthnode.height * adaptScaleH,
                destWidth: Widthnode.width * adaptScaleW,
                destHeight: Widthnode.height * adaptScaleH,
                fileType: "jpg",
                success: (res) => {
                    resolve(res);
                },
                fail: (err) => {
                    reject(err);
                }
            });
        });
    }
}
