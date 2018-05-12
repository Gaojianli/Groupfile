let Koa = require("koa");
let config = require('./config');
let route = require('./route/route');
const app = new Koa();

app.use(async(ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
    ctx.body
})
app.use(route);
app.listen(3000);
console.log('app started at port 3000...');