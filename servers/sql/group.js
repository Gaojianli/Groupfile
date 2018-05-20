let mongoose = require('mongoose');
let db = require('./db');
mongoose.connect(global.conf.mongodb.url, { config: { autoIndex: false } });
let group_info = mongoose.model('group_info', db.group_info);
let find_Gfile_list = (openGid,first,num) =>{
    return new Promise((rec,rej)=>{
        group_info.findOne({openGid: openGid}).populate('file_list').exec((err,rew)=>{
            if(err) console.log(err);
            if(global.conf.debug) console.log(rew);
            rec(rew);
        })
    })
}
let add_Gfile = (openGid,file_id) =>{
    return new Promise((rec,rej)=>{
        group_info.findOne({openGid: openGid}).exec((err,rew)=>{
            rew.file_list.push(file_id);
            rec(rew.save());
        })
    })
}
module.exports = {
    find_Gfile_list: find_Gfile_list,
    add_Gfile: add_Gfile
}