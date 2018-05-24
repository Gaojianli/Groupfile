if(!global.conf){
    global.conf = {};
}
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
    AppSecret: "84b204946f057a2d27989be0d5555121"
}
global.conf.debug = true;
global.conf.upload={
    type:'loacl',
    conf:{
        path: __dirname + '/uploadFile'
    }
}