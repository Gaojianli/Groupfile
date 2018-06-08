let user_info = require("../sql/user");
let session_token = require('../sql/session');
var WXBizDataCrypt = require('./_WXBizDataCrypt');
module.exports = async(ctx, next) => {
    let post = ctx.request.body;
    let user = await session_token.get_user(post.session_cookie);
    if (!user) {
        ctx.response.body = JSON.stringify({ success: false, error: 'cookie过期，请重试' });
        return;
    }
    user = await user_info.find_user_by_userid(user);
    let WXBizDataCrypt_new = new WXBizDataCrypt(global.conf.wxapp.AppID, user.session_key)
    let complete = WXBizDataCrypt_new.decryptData(post.encryptedData, post.vi);
    await user_info.update_user_complete_info(user, complete);
    ctx.response.body = JSON.stringify({ success: true });
    return;
}