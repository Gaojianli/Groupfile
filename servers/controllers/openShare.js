/*
API openShare
调用方式 POST
调用类型 post
传参 
    "session_cookie": "YOUR SESSION COOKIE",
    "encryptedData": "加密后的openGid",
    "vi":加密用的向量,
    "file_id": "file_id"
返回
    成功：
    {
        "success": true,
        "file": {
            "file_id": "THE FILE ID",
            "name": "THE FILE NAME",
            "upload_time": "",
            "type": "",
            "size": "KB",
            "download_num": 10
        }
    }
*/
let user_info = require('../sql/user');
let group_info = require('../sql/group');
let session_token = require('../sql/session');
let file_info = require('../sql/file');
var WXBizDataCrypt = require('./_WXBizDataCrypt');
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
module.exports = async(ctx, next) => {
    let post = ctx.request.body;
    let user = await session_token.get_user(post.session_cookie);
    if (!user) {
        ctx.response.body = JSON.stringify({ success: false, error: 'cookie过期，请重试' });
        return;
    }
    if (!await file_info.find_file(post.file_id)) {
        ctx.response.body = JSON.stringify({ success: false, error: '文件ID无效，请检查' });
        return;
    }
    let WXBizDataCrypt_new = new WXBizDataCrypt(global.conf.wxapp.AppID, user.session_key)
    let openGid = WXBizDataCrypt_new.decryptData(post.encryptedData, post.vi);
    let group = await group_info.find_group(openGid.openGId);
    let rec = await Promise.all([
        user_info.add_file(user._id, post.file_id),
        user_info.add_group(user._id, group._id),
        group_info.add_Gfile(group._id, post.file_id),
        file_info.find_file(post.file_id)
    ])
    let out = {};
    let file = rec[3];
    let d = new Date(file.upload_time);
    out.upload_time = d.Format('yy-MM-dd hh:mm');
    if (file.size < 1024) {
        out.size = file.size + 'B';
    } else if (file.size < 1024 * 1024) {
        out.size = (file.size / 1024).toFixed(2) + 'KB';
    } else if (file.size < 1024 * 1024 * 1024) {
        out.size = (file.size / (1024 * 1024)).toFixed(2) + "MB";
    }
    out.file_id = file._id;
    out.name = file.name;
    out.type = file.type;
    out.download_num = file.download_user_list.length;
    ctx.response.body = JSON.stringify({ success: true, file: out });
    return;
}