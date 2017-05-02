var part = {
    "颈椎病": ["颈椎", "左上肢", "右上肢"],
    "肩周炎": ["左肩关节", "右肩关节", "左上肢", "右上肢"],
    "腰椎病": ["腰椎", "左下肢", "右下肢"],
    "骨关节病": ["左膝关节", "右膝关节"],
    "脑卒中": ["左肩关节", "右肩关节", "左上肢", "右上肢", "左下肢", "右下肢"],
    "腱鞘炎": ["左手", "右手"],
    "带状疱疹": ["颈椎", "腰椎", "左肩关节", "右肩关节", "左膝关节", "右膝关节", "左上肢", "右上肢", "左下肢", "右下肢", "左手", "右手", "胸部", "后背", "腹部", "面部", "头顶"],
    "丹毒": ["左下肢", "右下肢"]
};

var goal = {
    "1": "改善ROM",
    "2": "增强肌力",
    "3": "缓解痉挛",
    "4": "促进血液循环",
    "5": "消肿解痛",
    "6": "改善微循环",
    "7": "松解粘连",
    "8": "增强活动能力",
    "99": "其他"
};

var notice = {
    "1": "密切观察，酌情调整",
    "2": "行走不稳或骨质疏松，预防跌倒",
    "3": "局部感觉障碍或循环不良，预防灼伤",
    "4": "骨折早期或未愈防再骨折",
    "5": "注意血压、心率变化",
    "6": "高血压病史",
    "7": "糖尿病病史",
    "99": "其他"
};

var caseType = {
    "1": "颈椎病",
    "2": "肩周炎",
    "3": "腰椎病",
    "4": "骨关节病",
    "5": "脑卒中",
    "6": "腱鞘炎",
    "8": "带状疱疹",
    "9": "丹毒"
};

var doctor = {
    "1": "杨新文",
    "2": "张巧燕",
    "3": "郭倩",
    "4": "袁亮",
    "5": "黄雯婷",
    "6": "张广恒",
    "7": "赖小勇",
    "8": "康嘉辉"
};

jQuery(function() {
    $('.spin').TouchSpin();

    $.validator.addMethod("Chinese", function(value, element) {
        var reg = /^[\u4E00-\u9FA5\uF900-\uFA2D]*$/;
        return this.optional(element) || reg.test(value);
    }, "请输入汉字");

    $.validator.addMethod("EnglishAndDigits", function(value, element) {
        var reg = /^[0-9a-zA-Z]*$/;
        return this.optional(element) || reg.test(value);
    }, "请输入字母与数字");
});

function modal(modal, container, content, method) {
    modal.modal({
        backdrop: 'static',
        keyboard: false,
    }).modal(method);
    container.html(content);
}

function formatNo(num, n) {
    var str = num.toString();
    var len = str.length;
    for (var i = 0; i < n - len; i++) {
        str = "0" + str;
    }
    return str;
}
