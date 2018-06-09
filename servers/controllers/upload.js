/*
API upload
*/
let upload_file = require('./_fileio').upload_file;
let user_info = require('../sql/user');
let session_token = require('../sql/session');
let file_info = require('../sql/file');
Date.prototype.Format = function(fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
let push_upload_msg = (rew, file_id) => {
    return new Promise(async(rec, rej) => {
        let file = await file_info.find_file(file_id);
        let d = new Date(file.upload_time);
        let out = {};
        out._id = file._id;
        out.upload_time = d.Format('yy-MM-dd hh:mm');
        out.name = file.name;
        out.type = file.type;
        console.log(cookie.session_cookie);
        for (const cookie of rew) {
            if (cookie.session_cookie in global.ws.upload && global.ws.upload[cookie.session_cookie].readyState == 1) {
                global.ws.upload[cookie.session_cookie].send(JSON.stringify({ success: "uploadListen", file: out }));
            }
        }
        rec(true);
    })
}
module.exports = async(ctx, next) => {
    let post = ctx.request.body.fields;
    let file = ctx.request.body.files.file;
    console.log(ctx.request.body);
    let user = await session_token.get_user(post.session_cookie);
    if (!user) {
        ctx.response.body = JSON.stringify({ success: false, error: 'cookie过期，请重试' });
        return;
    }
    let real_url = await upload_file(file);
    let file_id = await file_info.add_file(file.name, user, file.size, real_url);
    await user_info.add_file(user, file_id);
    ctx.response.body = JSON.stringify({ success: true });
    await session_token.find_user_all_cookie(user)
        .then((rew) => {
            return push_upload_msg(rew, file_id);
        })
    return;
}