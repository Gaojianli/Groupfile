let mongoose = require('mongoose');
let db = require('./db');
mongoose.connect(global.conf.mongodb.url, { config: { autoIndex: false } });
let file_info = mongoose.model('file_info', db.file_info);
let find_file = (file_id,user_id) => {
    return new Promise((rec,rej)=>{
        file_info.findById(file_id).populate('upload_user_id').exec((err,rew)=>{
            if(err) console.log(err);
            if(global.conf.debug) console.log(rew);
            if (rew.download_user_list.indexOf(user_id) == -1){
                rew.download_user_list.push(user_id);
            }
            rew.save()
            rec(rew);
        })
    })
}
let add_file = (name,uploader_id,real_url) =>{
    let now = new Date;
    let a_file = new file_info({
        name: name,
        upload_time: now,
        upload_user_id: uploader_id,
        real_url: real_url
    })
    a_file.save();
    return true;
}
module.exports = {
    find_file: find_file,
    add_file: add_file
}