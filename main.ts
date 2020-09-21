import { worker } from "cluster";
import { RSA_NO_PADDING } from "constants";
import { request } from "https";
import { stringify } from "querystring";
import { Md5 } from "ts-md5";
import { appid, secret } from "./private";
const md5 = new Md5();

const errorMap: { [key: string]: string } = {
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

type TranslateResult = {
  from: string;
  to: string;
  trans_result: {
    src: string;
    dst: string;
  }[];
  error_code?: string;
  error_msg?: string;
};

export const translate = (word: string) => {
  //   向百度api发起请求
  //   appid+q+salt+密钥
  const salt = Math.random();
  const sign = md5.appendStr(appid + word + salt + secret).end() as string;

  let from: string, to: string;
  if (/[A-z]/.test(word[0])) {
    from = "en";
    to = "zh";
  } else {
    from = "zh";
    to = "en";
  }

  const option = stringify({ q: word, from, to, appid, salt, sign });
  const options = {
    hostname: "api.fanyi.baidu.com",
    port: 443,
    path: `/api/trans/vip/translate?${option}`,
    method: "GET",
  };

  const req = request(options, (response) => {
    const chunks: Buffer[] = [];
    response.on("data", (chunk) => {
      chunks.push(chunk);
    });
    response.on("end", () => {
      const body = Buffer.concat(chunks).toString();
      const obj: TranslateResult = JSON.parse(body);
      if (obj.error_code) {
        console.log(errorMap[obj.error_code] || obj.error_msg);
      } else {
        console.log(obj.trans_result[0].dst);
      }
    });
  });
  req.end();
};
