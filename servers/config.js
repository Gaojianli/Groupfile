if (!global.conf) {
    global.conf = {};
}
if (!global.data) {
    global.data = {};
}
global.conf.root = "https://asdf.zhr1999.club";
global.conf.mongodb = {
    url: "mongodb://127.0.0.1:27017/groupfile",
    // url: "127.0.0.1",
    // port: 2701,
    // user: "",
    // password: "",
    // db: "groupfile"
}
global.conf.wxapp = {
    AppID: "wxb23cf79ae1526b93",
    AppSecret: "7a7d17d1f8c7d6e21bcf6a3b421ed361"
}
global.conf.debug = true;
global.conf.upload = {
    type: 'local',
    conf: {
        path: __dirname + '/uploadFile'
    }
}