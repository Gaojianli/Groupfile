const Koa = require('koa');
const route = require('./route/route');
const app = new Koa();

app.use(async(ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
})
app.use(route);
app.listen(3000);
console.log('app started at port 3000...');