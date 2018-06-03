let mongoose = require('mongoose');
let db = require('./db');
mongoose.connect(global.conf.mongodb.url, { config: { autoIndex: false } });

db.user_info.index({ openid: 1 });
db.user_info.statics.find_openid = function(openid, callback) {
    return this.findOne({ openid: new RegExp(openid, 'i') }, callback);
}
let user = mongoose.model('user_info', db.user_info);
let find_user_by_openid = (openid) => {
    return new Promise((res, rej) => {
        user.find_openid(openid, (err, rec) => {
            res(rec);
        });
    });
};
let add_user = async(user_info) => {
    let a_user = new user(user_info);
    let rec = await a_user.save();
    if (global.conf.debug) console.log(rec);
    return rec;
};
let update_user_session_key = (user_id, session_key) => {
    return new Promise((rec, rej) => {
        user.findById(user_id).exec(async(err, rew) => {
            if (err) console.log(err);
            if (global.conf.debug) console.log(rew);
            rew.session_key = session_key;
            await rew.save();
            rec(rew);
        })
    })
}
let update_user_complete_info = (user_id,complete)=>{
    return new Promise((rec,rej)=>{
        user.findById(user_id).exec(async(err,rew)=>{
            if(err) console.log(err);
            if(global.conf.debug) console.log(complete);
            rew.avatar_url = complete.avatarUrl;
            rew.full_info={
                nick_name: complete.nickName,
                gender: complete.gender,
                city: complete.city,
                province: complete.province,
                country: complete.country
            };
            await rew.save();
            rec(rew);
        })
    })
}
let update_user = (lim, data) => {
    return new Promise((rec, rej) => {
        user.updateOne(update.lim, { $set: update.data }, (err, raw) => {
            if (err) console.log(err);
            if (global.conf.debug) console.log(raw);
            rec(raw);
        });
    })
};
let find_file_list = (user_id, first, num) => {
    return new Promise((rec, rej) => {
        user.findById(user_id).
        populate({ path: "file_list", select: "-real_url -upload_user_id -download_user_list -size" }).
        exec((err, rew) => {
            if (err) console.log(err);
            if (global.conf.debug) console.log(rew);
            rec(rew.file_list);
        })
    })
}
let add_file = (user_id, file_id) => {
    return new Promise((rec, rej) => {
        user.findById(user_id).exec(async(err, rew) => {
            if (err) console.log(err);
            if (global.conf.debug) console.log(rew);
            if (rew.file_list.indexOf(file_id) == -1) {
                rew.file_list.push(file_id);
            }
            await rew.save();
            rec(rew);
        })
    })
}
let add_group = (user_id, group_id) => {
    return new Promise((rec, rej) => {
        user.findById(user_id).exec(async(err, rew) => {
            if (err) console.log(err);
            if (global.conf.debug) console.log(rew);
            if (rew.group_list.indexOf(group_id) == -1) {
                rew.group_list.push(group_id);
            }
            await rew.save();
            rec(rew);
        })
    })
}
let find_group_list = (user_id) => {
    return new Promise((rec, rej) => {
        user.findById(user_id).populate("group_list").exec((err, rew) => {
            if (err) console.log(err);
            if (global.conf.debug) console.log(rew);
            let out = [];
            for (const i of rew.group_list) {
                out.push(i.openGid);
            }
            rec(out);
        })
    })
}
module.exports = {
    find_user_by_openid: find_user_by_openid,
    add_user: add_user,
    update_user_session_key: update_user_session_key,
    update_user: update_user,
    update_user_complete_info: update_user_complete_info,
    find_file_list: find_file_list,
    add_file: add_file,
    add_group: add_group,
    find_group_list: find_group_list
}