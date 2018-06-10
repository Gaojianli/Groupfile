/*
API getGroupLIst
*/
let user_info = require('../sql/user');
let session_token = require('../sql/session');
module.exports = async(ctx, next) => {
    let post = ctx.request.body;
    let user = await session_token.get_user(post.session_cookie);
    if (!user) {
        ctx.response.body = JSON.stringify({ success: false, error: 'cookie过期，请重试' });
        return;
    }
    let group_list = await user_info.find_group_list(user);
    ctx.response.body = JSON.stringify({
        success: true,
        num: group_list.length,
        group_list: group_list
    });
    return;
}