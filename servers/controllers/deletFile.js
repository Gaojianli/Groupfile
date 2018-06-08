let user_info = require('../sql/user');
let session_token = require('../sql/session');
let file_info = require('../sql/file');
module.exports = async(ctx, next) => {
    let post = ctx.request.body;
    let user = await session_token.get_user(post.session_cookie);
    if (!user) {
        ctx.response.body = JSON.stringify({ success: false, error: 'cookie过期，请重试' });
        return;
    }
    let file = await file_info.find_file(post.file_id);
    if (!file) {
        ctx.response.body = JSON.stringify({ success: false, error: '文件ID无效，请检查' });
        return;
    }
    if (post.type == 'all') {
        if (file.upload_user_id == user) {
            file_info.remove_file(post.file_id);
            ctx.response.body = JSON.stringify({ success: true });
            return;
        } else {
            ctx.response.body = JSON.stringify({ success: false, error: "您不是文件的拥有者" });
            return;
        }
    } else {
        user = await user_info.find_user_by_userid(user);
        let index = -1;
        console.log(user.file_list);
        for (const key in user.file_list) {
            if (user.file_list.hasOwnProperty(key)) {
                const afile = user.file_list[key];
                if (afile == post.file_id) {
                    index = key;
                    break;
                }
            }
        }
        if (index > -1) {
            user.file_list.splice(index, 1);
            await user.save()
            ctx.response.body = JSON.stringify({ success: true });
            return;
        } else {
            ctx.response.body = JSON.stringify({ success: false, error: "文件不存在。" });
            return;
        }
    }
}