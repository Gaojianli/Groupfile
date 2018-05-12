let mongoose = require('mongoose');
let db = require('./db');
mongoose.connect(global.conf.mongodb.url);
let log = mongoose.model('log', db.log);
module.exports = async (obj) => {
    let a_log = new log(obj);
    let rec = await a_log.save();
    if(global.conf.debug) console.log(rec);
}