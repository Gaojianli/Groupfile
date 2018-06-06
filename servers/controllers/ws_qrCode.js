let session_token = require('../sql/session');
module.exports = async(ctx) => {
    let cookie = await session_token.new_cookie("web", null);
    global.data[cookie] = ctx.websocket;
    ctx.websocket.send(global.conf.root + "/api/scanCode?cookie=" + cookie);
    ctx.websocket.onclose = () => {
        delete global.data[cookie];
    }
}