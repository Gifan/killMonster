'use strict';
window.isWeChatPlatform = (function () {
    return typeof (wx) != "undefined";
})();

//***********************基础配置相关***********************//
window.MENU_SCENE_NAME = 'GameMenu'; //菜单场景名
window.GAME_SCENE_NAME = 'GameMain'; //游戏场景名
window.STEP_SCENE_NAME = 'GameStep'; // 段位场景名
//***********************************复活界面 *************************//
window.RELIVE_COST_PIC_PATH = 'sprite/icon_money'; //配置resources目录下的资源路径 复活界面上消耗货币图标
window.RELIVE_COST_NUM = 50; //复活消耗货币数
window.VIDEO_TIMES = 5;
window.SHARE_TIME = 2500;
window.bgmAudioID = -1;
//*************************************游戏相关**************************//
window.MUSIC_SHOW_OFF = 1;
window.BGM = 'sound/bgm.mp3';
window.BUTTON_CLICK_MUSIC = 'sound/button.mp3';
window.CHALLENG_VICTORY_MUSIC = 'sound/win.mp3';
window.CHALLENG_FAIL_MUSIC = 'sound/fail.mp3';
window.SKILL_ADD_HP = 'sound/addhp.mp3';
window.GET_GOLD = 'sound/getgoldmusic.mp3';
window.FENG = 'sound/feng.mp3';
window.BOMB = 'sound/boom.mp3';
window.BE_HIT = 'sound/mon1hit.mp3';
window.SAY_3 = 'sound/taibangle.mp3';
window.BOOM_EFFECT = 'sound/explode3.wav';
window.SERVER_TIME = 0;
window.GRID_WIDTH = 100;
window.GRID_HEIGHT = 100;

window.BOX_SHARE = false;
window.SKIN_SHARE = false;
window.MOVEGAME = true;
window.NEWYEAR = false;
window.SHOWNEWYEAR = false;
//类型0：空 类型2：士兵  类型1：可消除普通糖果 类型3：障碍 类型4：金币 类型5：功能性糖果
window.BLOCKLIST = [
    [],
    [{
        tag: 0,
        hp: 1,
        name: "red_block"
    },

    {
        tag: 1,
        hp: 2,
        name: "blue_block"
    },

    {
        tag: 2,
        hp: 3,
        name: "green_block"
    },

    {
        tag: 3,
        hp: 4,
        name: "yellow_block"
    },

    ],
    [{
        tag: 0,
        hp: 999,
        name: "solider"
    },

    ],
    [
        { tag: 0, hp: 999, name: "block_stone" },
    ],
    [{
        tag: 0,
        hp: 1,
        name: "gold_block"
    },

    ],
    [{
        tag: 0,
        hp: 1,
        name: "hp1_block",
    },
    {
        tag: 1,
        hp: 3,
        name: "hp3_block",
    },
    {
        tag: 2,
        hp: 5,
        name: "hp5_block",
    },
    ],
];

window.MONSTER_CONFIG = [{
    tag: 0,
    name: "monster0",
    scale: 2.0,
    bloodheight: 108,
    happy_talk: ["啊哈哈", "这波不亏，666", "体力充沛，干活不累！"],
    fail_talk: ["哭唧唧，我会回来的", "今天天气很好我先溜了。。。"],
    normal_talk: ["emmmmm!", "给过路费没", "想打倒我，没门", "我这么可爱你忍心打我？", "看个广告吧亲"],
    angry_talk: ["气死我啦！"],
    victoy_talk: ["哈哈，你是无法打败我的", "哈哈，愚蠢的凡人", "山头之王万岁！"],
    start_talk: ["此处山头是我开，不然的话。。。！", "额，我是谁，我在哪里", "黑魔法万岁~！", "亲，开发不易，来个视频吧"],
    attack_talk: ["我会阻挡你的攻击！", "看我的"],
},

{
    tag: 1,
    name: "monster1",
    scale: 1.7,
    bloodheight: 100,
    happy_talk: ["啊哈哈", "这波不亏，666", "体力充沛，干活不累！"],
    fail_talk: ["我会回来的", "走着瞧，我call鸡了，等着"],
    normal_talk: ["emmmmm!", "来打我呀!", "想打倒我，没门", "其实我是来客串的", "看个视频换一批吧"],
    angry_talk: ["气死我啦！", "受死吧你", "我不要被吃鸡"],
    victoy_talk: ["哈哈，你是无法打败我的", "哈哈，愚蠢的人类"],
    start_talk: ["风暴鸡在吃鸡，咯咯咯！", "鸡生蛋，蛋生鸡", "视频求点"],
    attack_talk: ["我会阻挡你的攻击！", "看我的石头碎击"],
},

{
    tag: 2,
    name: "monster2",
    scale: 1.7,
    bloodheight: 119,
    happy_talk: ["啊哈哈，", "这波不亏，666", "体力充沛，干活不累！"],
    fail_talk: ["我会回来的", "呀，我姑且退下，重新部署"],
    normal_talk: ["emmmmm!", "来打我呀!", "想打倒我，没门", "嫦娥呢！", "额，客官点下视频吧"],
    angry_talk: ["气死我啦！", "我们兔兔家族是不会放过你的！"],
    victoy_talk: ["哈哈，你是无法打败我的", "哈哈，愚蠢的人类"],
    start_talk: ["小兔兔来也，突突突！", "偷偷偷，有什么是可以让我偷的", "扮鬼扮马咩"],
    attack_talk: ["我会阻挡你的攻击！", "看我的石头碎击"],
},
{
    tag: 3,
    name: "monster3",
    scale: 1.3,
    bloodheight: 196,
    happy_talk: ["啊哈哈，", "这波不亏，666", "体力充沛，干活不累！"],
    fail_talk: ["我会回来的", "呀，我姑且退下，兽人永不为奴"],
    normal_talk: ["emmmmm!", "来领教一下我的虎拳", "想打倒我，没门", "你现在投降还来得及", "区区炸弹秒不了我！"],
    angry_talk: ["气死我啦！", "耻辱啊，耻辱啊！"],
    victoy_talk: ["哈哈，你是无法打败我的", "哈哈，愚蠢的人类", "你还是过几年再来吧"],
    start_talk: ["在下无敌，请多指教", "你是什么东西，放马过来", "部落必胜！"],
    attack_talk: ["我会阻挡你的攻击！", "看我的石头碎击"],
},
];

window.TOOL_CONFIG = [
    {
        tag: 0, nickname: "炸弹", tool_desc: "选择一个格子放置炸弹消灭周围全部糖果。", name: "boom_block",
    },
    {
        tag: 1, nickname: "武装强化", tool_desc: "强化你的糖果，使攻击伤害加倍。", name: "strong",
    }
];

// 0 购买  1分享获得
window.SKIN_CONFIG = [
    {
        tag: 0, price: 0, name: 'block', way: 0
    },
    {
        tag: 1, price: 100, name: 'block_bian', way: 0
    },
    {
        tag: 2, price: 200, name: 'block_di', way: 0
    },
    {
        tag: 3, price: 400, name: 'block_star', way: 0
    },
    {
        tag: 4, price: 600, name: 'block_monster', way: 1
    },
];

/**
 * type:触摸指定位置确认还是确认按钮确认1触摸2按钮
 * target: 字符串指向的目标节点的名字，相对于canvas下，整型-》指向对应的格子 -1无target
 * desc: 描述
 * dir:对应对话框方向2:向左 1：向右
 * descsize:{100,200}
 * delaytime: 延迟显示下一个引导时间  毫秒 类型为1的有效
 * offsetY y轴偏移量
 */
window.CONFIG_GUIDE = [
    [],
    [
        { type: 2, target: "Canvas/n_UI/sp_tool1", desc: "这里显示你拥有的小萌物，小萌物耗尽还没打倒怪物就算输哦！", descsize: [300, 200], dir: 2, delaytime: 0, offsetY: 0 },
        { type: 1, target: 41, desc: "点击糖果放置小萌物，糖果就会自动攻击怪物啦！", descsize: [300, 200], dir: 1, delaytime: 1200, offsetY: 0 },
        { type: 1, target: 37, desc: "太棒了！再放置一个萌物，2个萌物之间的糖果都会被卷走攻击怪物哦！", descsize: [310, 230], dir: 1, delaytime: 700, offsetY: 0 },
        { type: 2, target: "Canvas/n_gamenode/n_target/sp_targetbg", desc: "注意哦，这里显示的是攻击怪物有效的糖果！", descsize: [310, 230], dir: 1, delaytime: 0, offsetY: -250 },
        { type: 2, target: -1, desc: "再提醒一句，两只小萌物放置位置相邻效果大大减少！千万不要放置太贴近哦！", descsize: [310, 230], dir: 1, delaytime: 0, offsetY: 0 },
    ],
    [
        {
            type: 2, target: 40, desc: "注意哦，这个糖果会让怪物血量增加，要小心不要碰到它！", descsize: [300, 200], dir: 1, delaytime: 0, offsetY: 0
        },
    ],
    [
        {
            type: 2, target: 40, desc: "注意哦，石头糖果会阻碍同一条线上的萌物卷走糖果，使用炸弹可以消除石头糖果", descsize: [300, 200], dir: 1, delaytime: 0, offsetY: 0
        },
        {
            type: 2, target: "Canvas/n_UI/sp_tool2", desc: "使用炸弹可以消除石头糖果,快去尝试下吧", descsize: [300, 200], dir: 1, delaytime: 0, offsetY: 0
        },
    ],
    [
        {
            type: 2, target: "Canvas/n_gamenode/n_target/sp_targetbg", desc: "注意了，这个关卡里只有这两种糖果攻击怪物才有效", descsize: [310, 230], dir: 1, delaytime: 0, offsetY: -250
        },
    ],
];
//01白 2橙色 3绿 4蓝 5
window.MON_COLOR = [
    cc.Color.WHITE,
    cc.Color.WHITE,
    cc.Color.ORANGE,
    cc.Color.GREEN,
    cc.Color.BLUE,
    cc.Color.MAGENTA,
];

window.ENV = "killmonster-test-df9a23";

window.INDEX_TO_POINT = [[-220, 381], [-110, 381], [0, 381], [110, 381], [220, 381], [-275, 286], [-165, 286], [-55, 286], [55, 286], [165, 286], [275, 286], [-330, 191], [-220, 191], [-110, 191], [0, 191], [110, 191], [220, 191], [330, 191], [-385, 95], [-275, 95], [-165, 95], [-55, 95], [55, 95], [165, 95], [275, 95], [385, 95], [-440, 0], [-330, 0], [-220, 0], [-110, 0], [0, 0], [110, 0], [220, 0], [330, 0], [440, 0], [-385, -95], [-275, -95], [-165, -95], [-55, -95], [55, -95], [165, -95], [275, -95], [385, -95], [-330, -191], [-220, -191], [-110, -191], [0, -191], [110, -191], [220, -191], [330, -191], [-275, -286], [-165, -286], [-55, -286], [55, -286], [165, -286], [275, -286], [-220, -381], [-110, -381], [0, -381], [110, -381], [220, -381]];

window.STEP_CONFIG = [{ "id": 1, "star": 1, "desc": "小试牛刀", "desc_path": "stepname6", "icon_path": "stepicon6", "lv": 10 }, { "id": 2, "star": 2, "desc": "小试牛刀", "desc_path": "stepname6", "icon_path": "stepicon6", "lv": 20 }, { "id": 3, "star": 3, "desc": "小试牛刀", "desc_path": "stepname6", "icon_path": "stepicon6", "lv": 30 }, { "id": 4, "star": 1, "desc": "相当不错", "desc_path": "stepname7", "icon_path": "stepicon7", "lv": 40 }, { "id": 5, "star": 2, "desc": "相当不错", "desc_path": "stepname7", "icon_path": "stepicon7", "lv": 50 }, { "id": 6, "star": 3, "desc": "相当不错", "desc_path": "stepname7", "icon_path": "stepicon7", "lv": 60 }, { "id": 7, "star": 1, "desc": "信手拈来", "desc_path": "stepname8", "icon_path": "stepicon8", "lv": 70 }, { "id": 8, "star": 2, "desc": "信手拈来", "desc_path": "stepname8", "icon_path": "stepicon8", "lv": 80 }, { "id": 9, "star": 3, "desc": "信手拈来", "desc_path": "stepname8", "icon_path": "stepicon8", "lv": 90 }, { "id": 10, "star": 1, "desc": "轻车熟路", "desc_path": "stepname9", "icon_path": "stepicon9", "lv": 100 }, { "id": 11, "star": 2, "desc": "轻车熟路", "desc_path": "stepname9", "icon_path": "stepicon9", "lv": 110 }, { "id": 12, "star": 3, "desc": "轻车熟路", "desc_path": "stepname9", "icon_path": "stepicon9", "lv": 120 }, { "id": 13, "star": 1, "desc": "炉火纯青", "desc_path": "stepname10", "icon_path": "stepicon10", "lv": 130 }, { "id": 14, "star": 2, "desc": "炉火纯青", "desc_path": "stepname10", "icon_path": "stepicon10", "lv": 140 }, { "id": 15, "star": 3, "desc": "炉火纯青", "desc_path": "stepname10", "icon_path": "stepicon10", "lv": 150 }, { "id": 16, "star": 1, "desc": "神乎其技", "desc_path": "stepname11", "icon_path": "stepicon11", "lv": 160 }, { "id": 17, "star": 2, "desc": "神乎其技", "desc_path": "stepname11", "icon_path": "stepicon11", "lv": 170 }, { "id": 18, "star": 3, "desc": "神乎其技", "desc_path": "stepname11", "icon_path": "stepicon11", "lv": 180 }, { "id": 19, "star": 1, "desc": "成就惊人", "desc_path": "stepname12", "icon_path": "stepicon12", "lv": 190 }, { "id": 20, "star": 2, "desc": "成就惊人", "desc_path": "stepname12", "icon_path": "stepicon12", "lv": 200 }, { "id": 21, "star": 3, "desc": "成就惊人", "desc_path": "stepname12", "icon_path": "stepicon12", "lv": 210 }, { "id": 22, "star": 1, "desc": "势如破竹", "desc_path": "stepname13", "icon_path": "stepicon13", "lv": 220 }, { "id": 23, "star": 2, "desc": "势如破竹", "desc_path": "stepname13", "icon_path": "stepicon13", "lv": 230 }, { "id": 24, "star": 3, "desc": "势如破竹", "desc_path": "stepname13", "icon_path": "stepicon13", "lv": 240 }, { "id": 25, "star": 1, "desc": "登峰造极", "desc_path": "stepname14", "icon_path": "stepicon14", "lv": 250 }, { "id": 26, "star": 2, "desc": "登峰造极", "desc_path": "stepname14", "icon_path": "stepicon14", "lv": 260 }, { "id": 27, "star": 3, "desc": "登峰造极", "desc_path": "stepname14", "icon_path": "stepicon14", "lv": 270 }, { "id": 28, "star": 1, "desc": "傲视群雄", "desc_path": "stepname15", "icon_path": "stepicon15", "lv": 280 }, { "id": 29, "star": 2, "desc": "傲视群雄", "desc_path": "stepname15", "icon_path": "stepicon15", "lv": 290 }, { "id": 30, "star": 3, "desc": "傲视群雄", "desc_path": "stepname15", "icon_path": "stepicon15", "lv": 300 }, { "id": 31, "star": 1, "desc": "独孤求败", "desc_path": "stepname16", "icon_path": "stepicon16", "lv": 310 }, { "id": 32, "star": 2, "desc": "独孤求败", "desc_path": "stepname16", "icon_path": "stepicon16", "lv": 320 }, { "id": 33, "star": 3, "desc": "独孤求败", "desc_path": "stepname16", "icon_path": "stepicon16", "lv": 330 }, { "id": 34, "star": 1, "desc": "王者归来", "desc_path": "stepname17", "icon_path": "stepicon17", "lv": 340 }, { "id": 35, "star": 2, "desc": "王者归来", "desc_path": "stepname17", "icon_path": "stepicon17", "lv": 350 },{ "id": 36, "star": 3, "desc": "王者归来", "desc_path": "stepname17", "icon_path": "stepicon17", "lv": 360 }];
window.boomrange = [
    [[1, 6, 5], [2, 7, 13, 12, 11]],
    [[2, 7, 6, 0], [3, 8, 14, 13, 12, 5]],
    [[3, 8, 7, 1], [4, 9, 15, 14, 13, 6, 0]],
    [[4, 8, 9, 2], [10, 16, 15, 14, 7, 1]],
    [[10, 9, 3], [17, 16, 15, 8, 2]],
    [[0, 6, 12, 11], [1, 7, 13, 20, 19, 18]],
    [[1, 7, 13, 12, 5, 0], [2, 8, 14, 21, 20, 19, 11]],//6
    [[2, 8, 14, 13, 6, 1], [3, 9, 15, 22, 21, 20, 12, 5, 0]],
    [[3, 9, 15, 14, 7, 2], [4, 10, 16, 23, 22, 21, 13, 6, 1]],
    [[3, 10, 16, 15, 8, 3], [17.24, 23, 22, 14, 7, 2]],
    [[17, 16, 9, 4], [25, 24, 23, 15, 8, 3]],
    [[5, 12, 19, 18], [0, 6, 13, 20, 28, 27, 26]],//11
    [[6, 13, 20, 19, 11, 5], [1, 7, 14, 21, 29, 28, 27, 18]],
    [[7, 14, 21, 20, 12, 6], [2, 8, 15, 22, 30, 29, 28, 19, 11, 6, 0, 1]],
    [[8, 15, 22, 21, 13, 7], [3, 9, 16, 23, 31, 30, 29, 20, 12, 6, 1, 2]],
    [[9, 16, 23, 22, 14, 8], [4, 10, 17, 24, 32, 31, 30, 21, 13, 7, 2, 3]],
    [[10, 17, 24, 23, 15, 9], [3, 8, 14, 22, 31, 32, 33, 25]],//16
    [[10, 16, 24, 25], [4, 9, 15, 23, 32, 33, 34]],
    [[11, 19, 27, 26], [5, 12, 20, 28, 36, 35]],
    [[12, 20, 28, 27, 18, 11], [5, 6, 13, 21, 29, 37, 36, 35, 26]],
    [[13, 21, 29, 28, 19, 12], [7, 14, 22, 30, 38, 37, 36, 27, 18, 11, 5, 6]],
    [[14, 22, 30, 29, 20, 13], [8, 15, 23, 34, 39, 38, 37, 28, 19, 12, 6, 7]],//21
    [[15, 23, 31, 30, 21, 14], [9, 16, 24, 32, 40, 39, 38, 29, 20, 13, 7, 8]],
    [[16, 24, 32, 31, 22, 15], [10, 17, 25, 33, 41, 40, 39, 30, 21, 14, 8, 9]],
    [[17, 25, 33, 32, 23, 16], [10, 9, 15, 22, 31, 40, 41, 42, 34]],
    [[17, 24, 33, 34], [10, 16, 23, 32, 41, 42]],
    [[18, 27, 35], [11, 19, 28, 36, 43]],//26
    [[19, 28, 36, 35, 26, 18], [11, 12, 20, 29, 37, 44, 43]],
    [[19, 20, 29, 37, 36, 27], [12, 13, 21, 3, 38, 45, 44, 43, 35, 26, 18, 11]],
    [[21, 30, 38, 37, 28, 20], [13, 14, 22, 31, 39, 46, 45, 44, 36, 27, 19, 12]],
    [[21, 22, 31, 39, 38, 29], [13, 14, 15, 23, 32, 40, 47, 46, 45, 37, 28, 20]],
    [[22, 23, 32, 40, 39, 30], [14, 15, 16, 21, 24, 29, 33, 38, 41, 46, 47, 48]],//31
    [[23, 24, 31, 33, 40, 41], [15, 16, 17, 22, 25, 30, 34, 39, 42, 47, 48, 49]],
    [[24, 25, 32, 34, 41, 42], [16, 17, 23, 31, 40, 48, 49]],
    [[25, 33, 42], [17, 24, 32, 41, 49]],
    [[26, 27, 36, 43], [18, 19, 28, 37, 44, 50]],
    [[27, 28, 35, 37, 43, 44], [18, 19, 20, 26, 29, 38, 35, 50, 51]],//36
    [[28, 29, 36, 38, 44, 45], [19, 20, 21, 27, 30, 35, 39, 43, 46, 50, 51, 52]],
    [[29, 30, 37, 39, 45, 46], [20, 21, 22, 28, 31, 36, 40, 44, 47, 51, 52, 53]],
    [[30, 31, 38, 40, 46, 47], [21, 22, 23, 29, 32, 37, 41, 45, 48, 52, 53, 53]],
    [[31, 32, 39, 40, 47, 48], [22, 23, 24, 30, 33, 38, 42, 46, 49, 53, 54, 55]],
    [[32, 33, 40, 42, 48, 49], [23, 24, 25, 31, 34, 39, 47, 54, 55]],//41
    [[33, 34, 41, 49], [24, 25, 32, 40, 48, 55]],
    [[35, 36, 44, 50], [26, 27, 28, 37, 45, 51, 56]],
    [[36, 37, 43, 45, 50, 51], [27, 28, 29, 35, 38, 46, 52, 56, 57]],
    [[37, 38, 44, 46, 51, 52], [28, 29, 30, 36, 39, 43, 47, 50, 53, 56, 57, 58]],
    [[38, 39, 45, 47, 52, 53], [29, 30, 31, 37, 40, 44, 48, 51, 54, 57, 58, 59]],//46
    [[39, 40, 46, 48, 53, 54], [30, 31, 32, 38, 41, 45, 49, 52, 55, 58, 59, 60]],
    [[40, 41, 47, 49, 54, 55], [31, 32, 33, 39, 42, 46, 53, 59, 60]],
    [[41, 42, 48, 55], [32, 33, 34, 40, 47, 54, 60]],
    [[43, 44, 51, 56], [35, 36, 37, 45, 52, 57]],
    [[44, 45, 50, 52, 56, 57], [36, 37, 38, 43, 46, 53, 58]],//51
    [[45, 46, 51, 53, 57, 58], [37, 38, 39, 44, 47, 50, 54, 56, 59]],
    [[46, 47, 52, 54, 58, 59], [38, 39, 40, 45, 48, 51, 55, 57, 60]],
    [[47, 48, 53, 55, 59, 60], [39, 40, 41, 46, 52, 58, 49]],
    [[48, 49, 54, 60], [40, 41, 42, 47, 53, 59]],
    [[50, 51, 57], [43, 44, 45, 52, 58]],//56
    [[51, 52, 56, 58], [44, 45, 46, 50, 53, 59]],
    [[52, 53, 57, 59], [45, 46, 47, 51, 54, 56, 60]],
    [[53, 54, 58, 60], [46, 47, 48, 52, 57, 55]],
    [[54, 55, 59], [47, 48, 49, 53, 58]]
]
window.DISLIST = [
    //一个方向
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9, 10],
    [11, 12, 13, 14, 15, 16, 17],
    [18, 19, 20, 21, 22, 23, 24, 25],
    [26, 27, 28, 29, 30, 31, 32, 33, 34],
    [35, 36, 37, 38, 39, 40, 41, 42],
    [43, 44, 45, 46, 47, 48, 49],
    [50, 51, 52, 53, 54, 55],
    [56, 57, 58, 59, 60],

    //另一个方向
    [26, 35, 43, 50, 56],
    [18, 27, 36, 44, 51, 57],
    [11, 19, 28, 37, 45, 52, 58],
    [5, 12, 20, 29, 38, 46, 53, 59],
    [0, 6, 13, 21, 30, 39, 47, 54, 60],
    [1, 7, 14, 22, 31, 40, 48, 55],
    [2, 8, 15, 23, 32, 41, 49],
    [3, 9, 16, 24, 33, 42],
    [4, 10, 17, 25, 34],

    //横向
    [0, 5, 11, 18, 26],
    [1, 6, 12, 19, 27, 35],
    [2, 7, 13, 20, 28, 36, 43],
    [3, 8, 14, 21, 29, 37, 44, 50],
    [4, 9, 15, 22, 30, 38, 45, 51, 56],
    [10, 16, 23, 31, 39, 46, 52, 57],
    [17, 24, 32, 40, 47, 53, 58],
    [25, 33, 41, 48, 54, 59],
    [34, 42, 49, 55, 60],
];

/****************************活动开关配置*******************************/
window.SHARE_RELIVE = false;
window.LOGIN_REWARD = false;
window.INVATION_REWARD = false;

//****************************存储数据 ***********************/
window.TOOL_NUM = [1, 1];
window.SKIN_CONFIG_STATE = [2, 0, 0, 0, 0];
window.GAME_SAVE_TYPE = 2; //数据存储类型  1=本地存储  2=服务端存储
window.GAME_SAVE_HANDLER = 'handler_data';
window.GAME_UPDATE_DATA = 'update_data';
window.GAME_RANK_LISTENER = 'rank_listener';
window.ON_SHOW_BACK = 'onshowback';
window.INIT_GAME_SAVE_DATA = {
    top_score: 0,
    gold_num: 0,
    top_level: 0,
    tool: window.TOOL_NUM,
    skin: window.SKIN_CONFIG_STATE,
    login_time: "",
};