/*
API getFileList
调用类型 POST
参数 POST
{
    "session_cookie": "YOUR SESSION COOKIE",
    "openGid": "dXXXXXXX",    //可选，不传则默认查本人可见的文件。
    "first": 0,
    "num": 10
}
返回 JSON
COOKIE失效
    {
        "success": flase,
        "error": "cookie过期，请重试"
    }
成功
    {
        "success": true,
        "empty": false,
        "files":[
            {
                "_id": "文件的ID",
                "name": "文件名",
                "type": "文件类型",
                "upload_time": "上传时间"
            }，{。。。。}
        ]
    }
    如果请求的区域没有文件，就会返回空files。
*/

let session_token = require('../sql/session');
let file = require('../sql/file');
let group_info = require('../sql/group');
let user_info = require('../sql/user');
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
    let files = [];
    if (post.openGid) {
        files = await group_info.find_Gfile_list(post.openGid, post.first, post.num);
    } else {
        files = await user_info.find_file_list(user, post.first, post.num);
    }
    let empty = true;
    if (files.length > 0) {
        empty = false;
    }
    let tmp = [];
    for (key of files) {
        let a_file = {
            _id: key._id,
            name: key.name,
            type: key.type,
            upload_time: key.upload_time.Format('yy-MM-dd hh:mm')
        };
        tmp.push(a_file);
    }
    ctx.response.body = JSON.stringify({ success: true, files: tmp, empty: empty });
}