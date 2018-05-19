let mongoose = require('mongoose');
let random = new Promise((rec,rej)=>{
    require('crypto').randomBytes(16, function (ex, buf) {
        var token = buf.toString('hex');
        rec(token);
    });
}) 
let db = require('./db');
mongoose.connect(global.conf.mongodb.url, { config: { autoIndex: false } });
db.session_cookie_list.index({ session_cookie: 1 });
db.session_cookie_list.statics.find_session_cookie = function (session_cookie, callback) {
    return this.findOne({ session_cookie: new RegExp(session_cookie, 'i') }, callback);
}
let session_cookie = mongoose.model('session_cookie_list', db.session_cookie_list);
let new_cookie = async (type, userid) => {
    let token = await random;
    let a_cookie = new session_cookie({
        session_cookie: token,
        available: type,
        user_id: userid,
        last_check_time: new Date()
    })
    a_cookie.save();
    return token;
}
let update_cookie = (session_cookie,type, user_id)=>{
    return new Promise((rec,rej)=>{
        session_cookie.updateOne(
            {session_cookie: session_cookie},
            {
                $set:{
                    available: type,
                    user_id: user_id
                }
            },
            (err,raw)=>{
                if(err) console.log(err);
                if(global.conf.debug) console.log(raw);
                rec(raw);
        });
    })
}
let remove_userid = (userid, type) => {
    return session_cookie.remove({user_id: userid, available: type});
}
let get_user = (cookie)=>{
    return new Promise((rec,rej)=>{
        session_cookie.findOne({session_cookie: cookie}).populate('user_id').exec((err,rew)=>{
            if(err) console.log(err);
            if(global.conf.debug) console.log(rew);
            rec(rew.user_id);
        })
    })
}
module.exports = {
    new_cookie: new_cookie,
    update_cookie: update_cookie,
    remove_userid: remove_userid,
    get_user: get_user
}