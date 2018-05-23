let mongoose = require('mongoose');
let db = require('./db');
mongoose.connect(global.conf.mongodb.url, { config: { autoIndex: false } });
let file_info = mongoose.model('file_info', db.file_info);
let find_file = (file_id) => {
    return new Promise((rec,rej)=>{
        file_info.findById(file_id).exec((err,rew)=>{
            if(err) console.log(err);
            if(global.conf.debug) console.log(rew);
            rec(rew);
        })
    })
}
let add_file = async (name,uploader_id,size,real_url) =>{
    let now = new Date;
    let a_file = new file_info({
        name: name,
        upload_time: now,
        upload_user_id: uploader_id,
        size: size,
        real_url: real_url
    })
    await a_file.save();
    return true;
}
let find_file_real_url = (file_id,user_id)=>{
    return new Promise((rec,rej)=>{
        file_info.findById(file_id).exec(async(err,rew)=>{
            if(err) console.log(err);
            if(global.conf.debug) console.log(rew);
            if (rew.download_user_list.indexOf(user_id) == -1){
                rew.download_user_list.push(user_id);
            }
            await rew.save();
            rec(rew.real_url);
        })
    })
}
module.exports = {
    find_file: find_file,
    add_file: add_file,
    find_file_real_url: find_file_real_url
}