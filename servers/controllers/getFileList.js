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
        "files":[
            {
                "file_id": "文件的ID",
                "name": "文件名",
                "upload_time": "上传时间",  //2018-05-19T07:32:52.717Z 直接扔进 Date()就变对象了
                "download_num": 10        //这个文件被下载了几次
            }，{。。。。}
        ]
    }
    如果请求的区域没有文件，就会返回空files。
*/

let session_token = require('../sql/session');
let file = require('../sql/file');
let user_info = require('../sql/user');
Date.prototype.Format = function (fmt) { //author: meizz 
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
    if(!user){
        ctx.response.body = JSON.stringify({success:false,error:'cookie过期，请重试'});
        return;
    }
    let files = [];
    if(post.openGid){
        // TODO:
        files = await user_info.find_file_list(user._id,post.first,post.num);
    }else{
        files = await user_info.find_file_list(user._id,post.first,post.num);
    }
    let empty=true;
    if(files){
        empty = false;
    }
    for (const i of files) {
        let d = new Date(i.upload_time);
        i.upload_time = d.Format('yy-MM-dd hh:mm');
    }
    ctx.response.body = JSON.stringify({success:true,files:files,empty:empty});
}