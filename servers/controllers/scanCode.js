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
        if (global.ws.qr_scan[get.web_session_cookie] && global.ws.qr_scan[get.web_session_cookie].readyState == 1) {
            let complete_user_info = (await Promise.all([user_info.find_user_by_userid(user), session_token.add_user_id(get.web_session_cookie, user)]))[0];
            let out = {
                avatar_url: complete_user_info.avatar_url,
                nick_name: complete_user_info.full_info.nick_name,
            }
            global.ws.qr_scan[get.web_session_cookie].send(JSON.stringify({ success: "login_info", info: out }));
            ctx.response.body = JSON.stringify({ success: true });
        } else {
            ctx.response.body = JSON.stringify({ success: false, error: "二维码过期，请刷新页面扫描" });
        }
    } else {
        ctx.response.redirect('/');
        ctx.response.body = '<a href="/">Index Page</a>';
    }
}