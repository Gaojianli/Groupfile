// import { Query } from "mongoose";

// const Koa = require('koa');
// const app = new Koa();

// const one = (ctx, next) => {
//     console.log('>> one');
//     next();
//     console.log('<< one');
// }

// const two = (ctx, next) => {
//     console.log('>> two');
//     next();
//     console.log('<< two');
// }

// const three = (ctx, next) => {
//     console.log('>> three');
//     next();
//     console.log('<< three');
// }

// app.use(one);
// app.use(two);
// app.use(three);

// app.listen(3000);
// let conf = require("./config")
// let mongo = require("./sql/mongodbConnect").default.default
// const mongoose = require('mongoose');


// mongoose.connect('mongodb://localhost:27017/test');
// const con = mongoose.connection;
// con.on('error', console.error.bind(console, '连接数据库失败'));
// con.once('open',()=>{
//     //定义一个schema
//     let Schema = mongoose.Schema({
//         category:String,
//         name:String,
//         ojbk:Object
//     });
//     Schema.methods.eat = function(){
//         console.log("I've eatten one "+this.name);
//     }
//     //继承一个schema
//     let Model = mongoose.model("fruit",Schema);
//     //生成一个document
//     let apple = new Model({
//         category:'apple',
//         name:'apple',
//         ojbk:{
//             aaa:111,
//             bbb: "dsfdgfhj"
//         }
//     });
//     //存放数据
//     apple.save((err,apple)=>{
//         if(err) return console.log(err);
//         apple.eat();
//         //查找数据
//         Model.find({name:'apple'},(err,data)=>{
//             console.log(data);
//         })
//     });
// })
let config = require("./config");
let s = require('./sql/session');
let a = async ()=>{
console.log(await s.new_cookie({type: 'web'}));
}
a();
// let mongoose = require('mongoose');
// let db = require('./sql/db');
// mongoose.connect(global.conf.mongodb.url,{ config: { autoIndex: false } });
// db.user_info.statics.find_openid = function(openid, callback) {
//     return this.find({ openid: new RegExp(openid, 'i') }, callback);
// }
// let user = mongoose.model('user_info',db.user_info);

// let find_user_by_openid = (openid) => {
//     return new Promise((res,rej)=>{
//         user.find_openid(openid,(err, rec)=>{
//             console.log(err);
//             res(rec);
//         });
//     });
// };
// find_user_by_openid().then(console.log);

// let random = new Promise((rec,rej)=>{
//     require('crypto').randomBytes(16, function (ex, buf) {
//         var token = buf.toString('hex');
//         rec(token);
//     });
// }) 
// let a = async ()=>{
//     console.log(await random);
// }
// a();