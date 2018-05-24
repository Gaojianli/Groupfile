let fs = require('fs');
let join = require('path').join;
let random = new Promise((rec,rej)=>{
    require('crypto').randomBytes(32, function (ex, buf) {
        var token = buf.toString('hex');
        rec(token);
    });
}) 
let upload_file = (file)=>{
    return new Promise(async(rec,rej)=>{
        let conf = global.conf.upload.conf;
        let random_name = await random();
        if(global.conf.upload == 'loacl'){
            const reader = fs.createReadStream(file.path);
            const stream = fs.createWriteStream(join(conf.path,random_name));
            reader.pipe(stream);
            rec('local://'+join(conf.path,random_name));
        }else{
            throw "未定义的文件保存方式";
        }
    })
}
let download_file = (real_url,real_name) => {
    return new Promise((rec,rej)=>{
        let file = real_url.split('://');
        if(file[0] == 'local'){
            const reader = fs.createReadStream(file[1]);
            const stream = fs.createWriteStream(path.join(os.tmpdir(), real_name));
            reader.pipe(stream);
            rec(path.join(os.tmpdir(), real_name));
        }else{
            throw "未定义的文件保存方式";
        }
    })
}
module.exports = {
    upload_file: upload_file,
    download_file: download_file
}