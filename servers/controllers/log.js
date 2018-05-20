/*
API log
调用类型 POST
参数 JSON
{
    "type":"error"\"warning"\"info"\"log",
    "data": Object
}
返回 JSON
{
    "success": true\false,
}
*/
let log = require('../sql/log');
module.exports = async(ctx, next) => {
    await log(ctx.request.body);
    ctx.response.type = "json";
    ctx.response.body = JSON.stringify({success:true});
    next();
}
