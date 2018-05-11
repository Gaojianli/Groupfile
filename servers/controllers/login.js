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

*/
let http = require('http');
let jscode2session = (code) => {
    return new Promise((resolve, reject) => {
        http.get("https://api.weixin.qq.com/sns/jscode2session?"+
        "appid="+global.conf.wxapp.AppID+
        "&secret="+global.conf.wxapp.AppSecret+
        "&js_code="+code+
        "&grant_type=authorization_code",(req,res)=>{
            req.on('data',resolve);
            if(global.conf.debug) req.on('end',console.log);
        })
    })
}
module.exports = async (ctx, next)=>{
    let session =  JSON.parse(await jscode2session(ctx.query['code']));
    if(session["errcode"]){
        console.log("error:"+session+"|"+ctx.query['code']);
        ctx.response.type = "json";
        ctx.response.body = JSON.stringify({
            error: session["errcode"],
            errmsg: "invalid code"
        });
        next();
    }
    

}