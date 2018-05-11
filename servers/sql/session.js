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
let new_cookie = async (user) => {
    let token = await random;
    let a_cookie = new session_cookie({
        session_cookie: token,
        available: user.type,
        user_id: user.userid,
        last_check_time: new Date()
    })
    // a_cookie.save();
    return token;
}
let update_cookie = async ()
module.exports = {
    new_cookie: new_cookie
}