let mongoose = require('mongoose');
let db = require('./db');
mongoose.connect(global.conf.mongodb.url, { config: { autoIndex: false } });
let group_info = mongoose.model('group_info', db.group_info);
let find_group = (openGid) => {
    return new Promise((rec, rej) => {
        group_info.findOne({ openGid: openGid }).exec(async(err, rew) => {
            if (err) console.log(err);
            if (global.conf.debug) console.log(rew);
            if (!rew) {
                let a_group = new group_info({
                    openGid: openGid,
                    file_list: []
                })
                await a_group.save();
                rec(a_group._id);
            } else {
                rec(rew._id);
            }
        })
    })
}
let find_Gfile_list = (group_id, first, num) => {
    return new Promise((rec, rej) => {
        group_info.findById(group_id).
        populate({ path: "file_list", select: "-real_url -upload_user_id -download_user_list -size" }).
        exec((err, rew) => {
            if (err) console.log(err);
            if (global.conf.debug) console.log(rew);
            rec(rew);
        })
    })
}
let add_Gfile = (group_id, file_id) => {
    return new Promise((rec, rej) => {
        group_info.findById(group_id).exec(async(err, rew) => {
            if (rew.file_list.indexOf(file_id) == -1) {
                rew.file_list.push(file_id);
            }
            await rew.save();
            rec(rew);
        })
    })
}
module.exports = {
    find_Gfile_list: find_Gfile_list,
    add_Gfile: add_Gfile,
    find_group: find_group
}