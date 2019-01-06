const { ccclass, property } = cc._decorator;

declare var window: any;
declare var EVENT_LISTENER: any;
@ccclass
export default class SkinPanel extends cc.Component {

    @property(cc.Node)
    m_n_content: cc.Node = null;

    @property(cc.Prefab)
    m_pre_skinitem: cc.Prefab = null;

    @property(cc.SpriteFrame)
    ["m_star0"]: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    ["m_star1"]: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    ["m_star2"]: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    ["m_star3"]: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    ["m_star4"]: cc.SpriteFrame = null;

    private m_n_list: any = [];

    start() {
        EVENT_LISTENER.on(window.GAME_SAVE_HANDLER, this.updateData, this);
    }

    initData() {
        let data = window.SKIN_CONFIG;
        for (let i = 0; i < data.length; i++) {
            let node = cc.instantiate(this.m_pre_skinitem);
            node.parent = this.m_n_content;
            node.getComponent('SkinItem').updateData(i, data[i], this['m_star' + i]);
            this.m_n_list.push(node);
        }
    }

    updateData() {
        let data = window.SKIN_CONFIG;
        for (let i = 0; i < data.length; i++) {
            let node = this.m_n_list[i];
            node.getComponent('SkinItem').updateData(i, data[i], this['m_star' + i]);
        }
    }

    onDestroy() {
        EVENT_LISTENER.off(window.GAME_SAVE_HANDLER, this);
    }

    onClose() {
        this.node.active = false;
    }
    // update (dt) {}
}
