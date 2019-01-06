var Utils = require("Utils");
cc.Class({
    extends: cc.Component,

    properties: {
        m_n_mask: cc.Node,
        m_n_guide_circle: cc.Node,
        m_n_bubble1: cc.Node,
        m_n_bubble2: cc.Node,
        m_n_confirm: cc.Node,
        m_sp_maskbg: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
    },

    showGuide(tag, index) {
        // console.log("window.GUIDE_LEVEL", window.GUIDE_LEVEL);
        if (window.GUIDE_LEVEL >= tag) return;
        // console.log('shoGuide', tag, index);
        this.m_cur_tag = tag;
        this.m_cur_index = index;
        if (window.CONFIG_GUIDE[tag][index]) {
            this._guide_data = window.CONFIG_GUIDE[tag][index];
            this.setGuideInfo(this._guide_data);
        } else {
            this.node.active = false;
            window.GUIDE_LEVEL += 1;
            cc.sys.localStorage.setItem('guideinfo', '' + window.GUIDE_LEVEL);
            return;
        }
        if (!this.node.active) this.node.active = true;
    },

    touchStart(event) {
        if (this._guide_data.type == 2) {
            event.stopPropagation();
            return;
        } else {
            if (window.GAME_CONTROL) {
                let vec = event.touch.getLocation();
                let index = window.GAME_CONTROL.getTouchIndex(vec);
                if (index != this._guide_data.target) {
                    this._confirm = false;
                    event.stopPropagation();
                    return;
                } else {
                    this._confirm = true;
                }
            } else {
                this.node.active = false;
            }
        }
    },

    touchEnd(event) {
        if (this._guide_data.type != 2) {
            if (this._confirm) {
                this.showNextGuide();
            }
        }
        this._confirm = false;
    },

    showNextGuide() {
        this._guide_data.target = -2;
        this._guide_data.type = -1;
        setTimeout(() => {
            this.m_cur_index += 1;
            this.showGuide(this.m_cur_tag, this.m_cur_index);
        }, window.CONFIG_GUIDE[this.m_cur_tag][this.m_cur_index].delaytime);
    },

    onConfirmClick() {
        Utils.SetSoundEffect(window.BUTTON_CLICK_MUSIC, false, 1);
        this.showNextGuide();
    },

    setGuideInfo(data) {
        this.m_n_bubble1.active = (data.dir == 1);
        this.m_n_bubble2.active = (data.dir == 2);
        let bubblenode = data.dir == 1 ? this.m_n_bubble1 : this.m_n_bubble2;
        let descnode = cc.find("l_guide_desc", bubblenode);
        let dirpos = data.dir == 1 ? -1 : 1;
        descnode.width = data.descsize[0];
        descnode.height = data.descsize[1];
        descnode.getComponent(cc.Label).string = data.desc;
        bubblenode.width = data.descsize[0] + 100;
        bubblenode.height = data.descsize[1] + 50;
        let monnode = cc.find("sp_mon", bubblenode);
        monnode.y = bubblenode.height / 2;
        if (typeof (data.target) === 'string') {//目标点
            let node = cc.find(data.target);
            this.m_n_mask.position = node.position;
            this.m_n_mask.width = node.width + 10;
            this.m_n_mask.height = node.height + 10;
            bubblenode.x = this.m_n_mask.x + dirpos * this.m_n_mask.width / 2;
            bubblenode.y = this.m_n_mask.y + this.m_n_mask.height / 2 + data.offsetY;
            this.m_n_guide_circle.width = this.m_n_mask.width + 30;
            this.m_n_guide_circle.height = this.m_n_mask.height + 30;
            this.m_n_guide_circle.getComponent(cc.Animation).play();
            this.m_n_guide_circle.position = this.m_n_mask.position;
            this.m_sp_maskbg.x = -this.m_n_mask.x;
            this.m_sp_maskbg.y = -this.m_n_mask.y;
        } else if (typeof (data.target) === 'number') {
            if (data.target == -1) {
                this.m_n_mask.width = 0;
                this.m_n_mask.height = 0;
                this.m_n_guide_circle.width = 0;
                bubblenode.y = 0;
                bubblenode.x = 0;
            } else {
                if (window.GAME_CONTROL) {
                    let node = window.GAME_CONTROL.getTargetGridInfo(data.target);
                    this.m_n_mask.position = node.position;
                    this.m_n_mask.width = node.width + 10;
                    this.m_n_mask.height = node.height + 10;
                    bubblenode.x = this.m_n_mask.x + dirpos * this.m_n_mask.width / 2;
                    bubblenode.y = this.m_n_mask.y + this.m_n_mask.height / 2 + data.offsetY;
                    this.m_n_guide_circle.width = this.m_n_mask.width + 30;
                    this.m_n_guide_circle.height = this.m_n_mask.height + 30;
                    this.m_n_guide_circle.getComponent(cc.Animation).play();
                    this.m_n_guide_circle.position = this.m_n_mask.position;
                    this.m_sp_maskbg.x = -this.m_n_mask.x;
                    this.m_sp_maskbg.y = -this.m_n_mask.y;
                }
            }
        }
        if (data.type == 2) {
            this.m_n_confirm.active = true;
            this.m_n_confirm.x = bubblenode.x + dirpos * bubblenode.width / 2;
            this.m_n_confirm.y = bubblenode.y - 40;
        } else {
            this.m_n_confirm.active = false;
        }
    },
    // update (dt) {},
});
