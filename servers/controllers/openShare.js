/*
API openShare
调用方式 POST
调用类型 post
传参 
    "session_cookie": "YOUR SESSION COOKIE",
    "openGid": "SHEAR openGid",
    "file_id": "file_id"
返回
    成功：
    {
        "success": true,
        "file": {
            "file_id": "THE FILE ID",
            "name": "THE FILE NAME",
            "upload_time": "",
            "download_num": 10
        }
    }
*/
let user = require('../sql/user');
let group_info = require('../sql/group');

