/*
API upload
*/
let upload_file = require('./_fileio').upload_file;
let user_info = require('../sql/user');
let session_token = require('../sql/session');
let file_info = require('../sql/file');
module.exports = async(ctx,next)=>{
    let post = ctx.request.body.fields;
    let file = ctx.request.body.files.file;
    let user = await session_token.get_user(post.session_cookie);
    if(!user){
        ctx.response.body = JSON.stringify({success:false,error:'cookie过期，请重试'});
        return;
    }
    let real_url = await upload_file(file);
    let file_id = await file_info.add_file(file.name,user._id,file.size,real_url);
    await user_info.add_file(user._id,file_id);
    ctx.response.body = JSON.stringify({success:true});
    return;
}