
const { ccclass, property } = cc._decorator;

@ccclass
export default class BigStepItem extends cc.Component {


    @property(cc.Sprite)
    m_sp_stepicon: cc.Sprite = null;

    @property(cc.Sprite)
    m_sp_stepname: cc.Sprite = null;

    @property(cc.Node)
    m_n_lock: cc.Node = null;

    @property(cc.Label)
    m_l_condition: cc.Label = null;

    @property([cc.Node])
    m_n_starlist: cc.Node[] = [];

    start() {

    }

    updateData(data, spframe, spframe1, curlv, color: number = 0) {
        let colorlist = ['#33ABEE', '#33EEEE', '#33EE94', '#BAE789'];
        if (data) {
            this.node.color = cc.hexToColor(colorlist[color]);
            this.m_sp_stepicon.spriteFrame = spframe;
            this.m_sp_stepname.spriteFrame = spframe1;
            for (let i = 0; i < this.m_n_starlist.length; i++) {
                this.m_n_starlist[i].active = i < data.star;
            }
            this.m_n_lock.active = data.lv > curlv;
            if (data.lv > curlv) {
                this.m_l_condition.node.y = -33;
                this.m_l_condition.string = cc.js.formatStr("需通关%d关", data.lv);
            } else {
                this.m_l_condition.node.y = 0;
                this.m_l_condition.string = "已获得";
            }
        }
    }

    // update (dt) {}
}
