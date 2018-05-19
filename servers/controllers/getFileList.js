/*
API getFileList
调用类型 POST
参数 JSON
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
let user_info = require('../sql/user');
let session_token = require('../sql/session');
let file = require('../sql/file');

module.exports = async(ctx, next) => {
    let post = JSON.parse(ctx.request.body);
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
    let out = [];
    for(a_file in files){
        out.push({
            file_id: a_file._id,
            name: a_file.name,
            upload_time: a_file.upload_time,
            download_num: a_file.download_user_list.length
        })
    }
    ctx.response.body = JSON.stringify({success:true,files:out});
}