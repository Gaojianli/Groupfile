let mongoose = require('mongoose');
let db = require('./db');
mongoose.connect(global.conf.mongodb.url,{ config: { autoIndex: false } });

db.user_info.index({openid: 1});
db.user_info.statics.find_openid = function(openid, callback) {
    return this.find({ openid: new RegExp(openid, 'i') }, callback);
}
let user = mongoose.model('user_info', db.user_info);
let find_user_by_openid = (openid) => {
    return new Promise((res,rej)=>{
        user.find_openid(openid,(err, rec)=>{
            res(rec);
        });
    });
};
let add_user = async(user_info,next) => {
    let a_user = new user(user_info);
    let rec = await a_user.save();
    if(global.conf.debug) console.log(rec);
};
let update_user = async(update,next) => {
    user.updateOne(update.lim,update.data,(err,raw)=>{
        if(err) console.log(err);
        if(global.conf.debug) console.log(raw);
        next(raw);
    });
};
module.exports = {
    find_user_by_openid: find_user_by_openid,
    add_user: add_user,
    update_user: update_user
}
