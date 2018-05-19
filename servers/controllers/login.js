/*
API login
调用方式 GET
参数
    code:临时登录凭证code
实例
    https://asdf.zhr1999.club/api/login?code=dsafasdgadds
返回
    类型:JSON
    例子:
        失败：
        {"error":40029,"errmsg":"invalid code"}
        成功：
        {"sess":true,"session_cookie":"b985d1e102df52d8332aeb7b4655295b"}

*/
let https = require('https');
let user = require('../sql/user');
let session_token = require('../sql/session');
let jscode2session = (code) => {
    return new Promise((resolve, reject) => {
        https.get("https://api.weixin.qq.com/sns/jscode2session?" +
            "appid=" + global.conf.wxapp.AppID +
            "&secret=" + global.conf.wxapp.AppSecret +
            "&js_code=" + code +
            "&grant_type=authorization_code", (req, res) => {
                req.on('data', resolve);
                if (global.conf.debug) req.on('end', console.log);
            })
    })
}
module.exports = async (ctx, next) => {
    let session = JSON.parse(await jscode2session(ctx.query['code']));
    if (session["errcode"]) {
        console.log("error:" + JSON.stringify(session) + "|" + ctx.query['code']);
        ctx.response.type = "json";
        ctx.response.body = JSON.stringify({
            error: session["errcode"],
            errmsg: "invalid code"
        });
        await next();
        return;
    }
    //let session = {openid: "DEMO",session_key: "SESSIONKEY"}
    let user_info = await user.find_user_by_openid(session.openid);
    if (user_info) {
        await session_token.remove_userid(user_info.id,'wx');
    }else{
        user_info = await user.add_user({
            openid: session.openid,
            session_key: session.session_key
        })
    }
    let session_cookie = await session_token.new_cookie("wx", user_info.id);
    ctx.response.type = "json";
    ctx.response.body = JSON.stringify({
        sess: true,
        session_cookie: session_cookie
    })
    next();
}