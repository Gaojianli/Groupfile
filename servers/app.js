let Koa = require("koa");
// let bodyParser = require('koa-bodyparser');
let websocket = require('koa-websocket')
let bodyParser = require('koa-body');
let config = require('./config');
let route = require('./route/route');
const app = websocket(new Koa());
// WARRING: THIS CONFIG IS DANGOURS, MAST MAKESURE IT BE REMOVE WHITOUT TEST.
let cors = require('koa-cors');
app.use(cors());
app.ws.use(route.ws);
app.use(bodyParser({ multipart: true }));
app.use(async(ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
})
app.use(async(ctx, next) => {
    if (ctx.request.method == "POST") {
        // for(ctx.request.body in ctx.request.body);
        if (global.conf.debug) console.log(ctx.request.body);
    } else if (ctx.request.method == "OPTIONS") {
        ctx.response.status = 200;

    }
    await next();
})
app.use(route.common);
app.listen(8082, '127.0.0.1');
console.log('app started at port 8082...');