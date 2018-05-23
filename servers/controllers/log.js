/*
API log
调用类型 POST
参数 POST
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
    try {  
        if (typeof JSON.parse(ctx.request.body.data) == "object") {  
            ctx.request.body.data = JSON.parse(ctx.request.body.data);
            await log(ctx.request.body); 
        }  
    } catch(e) {
        await log(ctx.request.body); 
    }
    ctx.response.type = "json";
    ctx.response.body = JSON.stringify({success:true});
    next();
}
