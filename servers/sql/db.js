let mongoose = require('mongoose');
let Schema = mongoose.Schema;
// mongoose.connect(global.conf.mongodb.url,{ config: { autoIndex: false } });
let user_info = new Schema({
    openid: String,
    session_key: String,
    grop_list: [{type: mongoose.Schema.ObjectId, ref: "group_info"}],
    file_list: [{type: mongoose.Schema.ObjectId, ref: "file_info"}],
    password: String,
    uuid: String,
    unionid: String,
    avatar_url: String,
    full_info:{
        nick_name: String,
        gender: String,
        city: String,
        province: String,
        country: String
    }
});
let file_info = new Schema({
    name: String,
    upload_time: Date,
    upload_user_id: {type: mongoose.Schema.ObjectId, ref: "user_info"},
    real_url: String,
    type: String,
    size: Number,
    download_user_list: [{type: mongoose.Schema.ObjectId, ref: "user_info"}]
});
let group_info = new Schema({
    openGid: String,
    file_list: [{type: mongoose.Schema.ObjectId, ref: "file_info"}]
});
let session_cookie_list = new Schema({
    session_cookie: String,
    available: String,
    user_id: {type: mongoose.Schema.ObjectId, ref: "user_info"},
    last_check_time: Date
})
let log = new Schema({
    type: String,
    data: Object
});
module.exports = {
    user_info: user_info,
    file_info: file_info,
    group_info: group_info,
    session_cookie_list: session_cookie_list,
    log: log
}