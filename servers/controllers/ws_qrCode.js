let session_token = require('../sql/session');
module.exports = async(ctx) => {
    let cookie = await session_token.new_cookie("web", null);
    global.ws.qr_scan[cookie] = ctx.websocket;
    ctx.websocket.send(JSON.stringify({ success: "get_qrCode", qrurl: global.conf.root + "/api/scanCode?cookie=" + cookie }));
    ctx.websocket.on('close', () => {
        delete global.ws.qr_scan[cookie];
    })
}