let user_info = require('../sql/user');
let session_token = require('../sql/session');
let file_info = require('../sql/file');
let delet = require('./_fileio').delete_file;
let push_delet_msg = (user, file_id) => {
    return session_token.find_user_all_cookie(user)
        .then((rew) => {
            return new Promise(async(rec, rej) => {
                for (const cookie of rew) {
                    if (cookie.session_cookie in global.ws.upload && global.ws.upload[cookie.session_cookie].readyState == 1) {
                        global.ws.upload[cookie.session_cookie].send(JSON.stringify({ success: "removeFile", id: file_id }));
                    }
                }
                rec(true);
            });
        })
}
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
        if (file.upload_user_id.toString() == user.toString()) {
            if (await delet(file.real_url)) {
                await file_info.remove_file(post.file_id);
                ctx.response.body = JSON.stringify({ success: true });
                await push_delet_msg(user, post.file_id);
                return;
            } else {
                ctx.response.body = JSON.stringify({ success: false, error: "删除文件失败，请和开发者联系" });
                return;
            }
        } else {
            ctx.response.body = JSON.stringify({ success: false, error: "您不是文件的拥有者" });
            return;
        }
    } else {
        user = await user_info.find_user_by_userid(user);
        let index = -1;
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
            await push_delet_msg(user._id, post.file_id);
            return;
        } else {
            ctx.response.body = JSON.stringify({ success: false, error: "文件不存在。" });
            return;
        }
    }
}