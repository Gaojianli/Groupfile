let fs = require('fs');
let join = require('path').join;
let os = require('os');
let random = new Promise((rec, rej) => {
    require('crypto').randomBytes(32, function(ex, buf) {
        var token = buf.toString('hex');
        rec(token);
    });
})
let upload_file = (file) => {
    return new Promise(async(rec, rej) => {
        let conf = global.conf.upload.conf;
        let random_name = await random;
        if (global.conf.upload.type == 'local') {
            fs.writeFileSync(join(conf.path, random_name), fs.readFileSync(file.path));
            rec('local://' + join(conf.path, random_name));
        } else {
            throw "未定义的文件保存方式";
        }
    })
}
let download_file = (real_url, real_name) => {
    return new Promise((rec, rej) => {
        let file = real_url.split('://');
        let conf = global.conf.upload.conf;
        if (file[0] == 'local') {
            fs.writeFileSync(join(os.tmpdir(), real_name), fs.readFileSync(file[1]));
            rec(join(os.tmpdir(), real_name));
        } else {
            throw "未定义的文件保存方式";
        }
    })
}
let delete_file = (real_url) => {
    return new Promise((rec, rej) => {
        let file = real_url.split('://');
        let conf = global.conf.upload.conf;
        if (file[0] == 'local') {
            fs.unlink(file[1], (err) => {
                if (err) throw err;
                rec(true);
            });
        } else {
            throw "未定义的文件保存方式";
        }
    })
}
module.exports = {
    upload_file: upload_file,
    download_file: download_file,
    delete_file: delete_file
}