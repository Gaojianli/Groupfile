/*
API download
*/
let send = require('koa-send');
let download_file = require('./_fileio').download_file;
let user_info = require('../sql/user');
let session_token = require('../sql/session');
let file_info = require('../sql/file');
module.exports = async(ctx,next)=>{
    let post = ctx.request.body;
    let user = await session_token.get_user(post.session_cookie);
    if(!user){
        ctx.response.body = JSON.stringify({success:false,error:'cookie过期，请重试'});
        return;
    }
    if(!post.file_id in user.file_list){
        ctx.response.body = JSON.stringify({success:false,error:'非法请求'});
        return;
    }
    let file = await file_info.find_file_add_list(post.file_id,user._id);
    let real_url = await download_file(fiel.real_url,file.name+'.'+file.type);
    await send(ctx, real_url,{ root: '/' });
    return;
}