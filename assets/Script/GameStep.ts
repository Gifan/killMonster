
import Utils = require("./common/Utils");

const { ccclass, property } = cc._decorator;
declare var window: any;
@ccclass
export default class GameStep extends cc.Component {

    @property(cc.SpriteAtlas)
    m_spa_list: cc.SpriteAtlas = null;


    @property(cc.Node)
    m_n_bigstepcontent: cc.Node = null;

    @property(cc.Sprite)
    m_sp_mystepicon: cc.Sprite = null;

    @property(cc.Sprite)
    m_sp_mystepname: cc.Sprite = null;

    @property([cc.Node])
    m_n_mystarlist: cc.Node[] = [];

    @property(cc.Prefab)
    m_pre_bigstep: cc.Prefab = null;

    private m_nodepoll = null;
    /**当前最后排名数 */




    start() {

        let len = window.STEP_CONFIG.length;
        this.m_n_bigstepcontent.height = len * 115 + (len - 1) * 20;
        let k = 0;
        for (let i = len - 1; i >= 0; i--) {
            let node = cc.instantiate(this.m_pre_bigstep);
            node.x = 0;
            node.y = -62 - (len - i - 1) * (node.height + 20);
            this.m_n_bigstepcontent.addChild(node);
            let data = window.STEP_CONFIG[i];
            let index = k % 4;
            node.getComponent("BigStepItem").updateData(data, this.m_spa_list.getSpriteFrame(data.icon_path), this.m_spa_list.getSpriteFrame(data.desc_path), window.INIT_GAME_SAVE_DATA.top_level, index);
            k++;
        }
        this.m_n_bigstepcontent.parent.parent.getComponent(cc.ScrollView).scrollToOffset(cc.v2(0, this.m_n_bigstepcontent.height));
        this.initMyData();
    }

    private onToggleClick(event) {

    }

    initMyData() {
        let curlv = window.INIT_GAME_SAVE_DATA.top_level;
        let data = this.getMyStepData(curlv);
        if (data) {
            this.m_sp_mystepicon.spriteFrame = this.m_spa_list.getSpriteFrame(data.icon_path);
            this.m_sp_mystepname.spriteFrame = this.m_spa_list.getSpriteFrame(data.desc_path);
            for (let i = 0; i < this.m_n_mystarlist.length; i++) {
                this.m_n_mystarlist[i].active = i < data.star;
            }
            // this.m_n_mybigstep.getComponent("BigStepItem").updateData(data, this.m_spa_list.getSpriteFrame(data.icon_path), curlv);
        } else {
            this.m_sp_mystepicon.spriteFrame = this.m_spa_list.getSpriteFrame("stepicon6");
            this.m_sp_mystepname.spriteFrame = this.m_spa_list.getSpriteFrame("stepname6");
            for (let i = 0; i < this.m_n_mystarlist.length; i++) {
                this.m_n_mystarlist[i].active = i <= 0;
            }
            // this.m_n_mybigstep.getComponent("BigStepItem").updateData(window.STEP_CONFIG[0], this.m_spa_list.getSpriteFrame("stepicon1"), curlv);
        }
    }


    onBackHome() {
        Utils.SetSoundEffect(window.BUTTON_CLICK_MUSIC, false, 1);
        cc.director.loadScene(window.MENU_SCENE_NAME);
    }

    /**
     * @description 根据等级获取我的段位数据
     * @author 吴建奋
     * @param {number} lv 等级
     * @memberof GameStep
     */
    getMyStepData(lv: number) {
        let index = Math.floor(lv / 10);
        if (index <= 0) {
            return null;
        } else {
            if (index > window.STEP_CONFIG.length)
                index = window.STEP_CONFIG.length;
            return window.STEP_CONFIG[index - 1];
        }
    }

    onDestroy() {
        if (this.m_nodepoll) {
            this.m_nodepoll.clear();
        }
    }
    // update (dt) {}
}
