let Koa = require("koa");
let bodyParser = require('koa-bodyparser');
let config = require('./config');
let route = require('./route/route');
const app = new Koa();
app.use(bodyParser());
app.use(async(ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
})
app.use(async(ctx, next)=>{
    if(ctx.request.method == "POST"){
        for(ctx.request.body in ctx.request.body);
        if(global.conf.debug) console.log(ctx.request.body);
    }
    await next();
})
app.use(route);
app.listen(3000);
console.log('app started at port 3000...');