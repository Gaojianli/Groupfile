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
    let empty=false;
    if(files){
        empty = true;
    }
    ctx.response.body = JSON.stringify({success:true,files:files,empty:empty});
}