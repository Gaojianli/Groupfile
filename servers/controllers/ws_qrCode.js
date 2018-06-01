let session_token = require('../sql/session');
module.exports = (ctx) => {
    let cookie = session_token.new_cookie("web", "");
    global.data[cookie] = ctx.websocket;
    ctx.websocket.send(global.conf.root + "/api/scanCode?cookie=" + cookie);
    ctx.websocket.onclose = () => {
        delete global.data[cookie];
    }
}