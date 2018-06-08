let session_cookie = require('../sql/session');
module.exports = async(ctx) => {
    var cookie = null;
    ctx.websocket.onmessage = (rec) => {
        let user = session_cookie.get_user(rec.data);
        if (!user) {
            ctx.websocket.send(JSON.stringify({ success: "error" }))
            ctx.websocket.close();
        }
        cookie = rec.data;
        global.ws.upload[cookie] = ctx.websocket;
        ctx.websocket.send(JSON.stringify({ success: "uploadListen" }))
    }
    ctx.websocket.onclose = () => {
        if (cookie) {
            delete global.ws.qr_scan[cookie];
        }
    }
}