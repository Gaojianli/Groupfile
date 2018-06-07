let session_token = require('../sql/session');
let user_info = require('../sql/user');
module.exports = async(ctx, next) => {
    if (ctx.request.headers['user-agent'].indexOf("MicroMessenger") != -1 || ctx.request.headers['user-agent'].indexOf("wechatdevtools") != -1) {
        let get = ctx.query;
        let user = await session_token.get_user(get.session_cookie);
        if (!user) {
            ctx.response.body = JSON.stringify({ success: false, error: 'cookie过期，请重试' });
            return;
        }
        if (global.data[get.web_session_cookie] && global.data[get.web_session_cookie].readyState == 1) {
            global.data[get.web_session_cookie].send("success");
            ctx.response.body = JSON.stringify({ success: true });
        } else {
            ctx.response.body = JSON.stringify({ success: false, error: "二维码过期，请刷新页面扫描" });
        }
    } else {
        ctx.response.redirect('/');
        ctx.response.body = '<a href="/">Index Page</a>';
    }
}