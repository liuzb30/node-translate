"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translate = void 0;
var https_1 = require("https");
var querystring_1 = require("querystring");
var ts_md5_1 = require("ts-md5");
var private_1 = require("./private");
var md5 = new ts_md5_1.Md5();
var errorMap = {
    52002: "系统错误，请重试",
    52003: "未授权用户	请检查您的appid是否正确，或者服务是否开通",
    54000: "请检查是否少传参数",
    54001: "签名错误",
    54003: "访问频率受限",
    54004: "账户余额不足",
    54005: "长query请求频繁,请降低长query的发送频率，3s后再试",
    58000: "客户端IP非法",
    58001: "译文语言方向不支持",
    58002: "服务当前已关闭",
    90107: "认证未通过或未生效",
};
exports.translate = function (word) {
    //   向百度api发起请求
    //   appid+q+salt+密钥
    var salt = Math.random();
    var sign = md5.appendStr(private_1.appid + word + salt + private_1.secret).end();
    var from, to;
    if (/[A-z]/.test(word[0])) {
        from = "en";
        to = "zh";
    }
    else {
        from = "zh";
        to = "en";
    }
    var option = querystring_1.stringify({ q: word, from: from, to: to, appid: private_1.appid, salt: salt, sign: sign });
    var options = {
        hostname: "api.fanyi.baidu.com",
        port: 443,
        path: "/api/trans/vip/translate?" + option,
        method: "GET",
    };
    var req = https_1.request(options, function (response) {
        var chunks = [];
        response.on("data", function (chunk) {
            chunks.push(chunk);
        });
        response.on("end", function () {
            var body = Buffer.concat(chunks).toString();
            var obj = JSON.parse(body);
            if (obj.error_code) {
                console.log(errorMap[obj.error_code] || obj.error_msg);
            }
            else {
                console.log(obj.trans_result[0].dst);
            }
        });
    });
    req.end();
};
