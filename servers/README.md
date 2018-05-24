## 后台API一览表
### 通用部分
#### log
##### 使用说明
地址: /api/log

调用: POST

说明: 用来返回一些乱七八糟的记录,方便调试(虽然一直没怎么用)

|参数名|必须|备注|
|:-|:-|:-|
|type|是|可选值 error,warning,info,log|
|data|是|可以是文字,也可以是JSON对象|

返回: 

|参数名|说明|
|:-|:-|
|success|true:成功写入记录<br>false:写入失败|

##### 样例
请求:

POST https://example.com/api/log

type=warning&data={"data":"我爱上了杜甫",{"err":false,"massage":"但是杜甫不爱我"}}

返回:

成功时

```JSON
{
    "success": true,
}
```

失败时

```JSON
{
    "success": false,
}
```
### 微信小程序专用
#### login
##### 使用说明
地址: /api/login

调用: GET

说明: 用于后台和微信服务器进行交互,获得用户信息,并按照微信开发要求生成专用的session_cookie用于用户交互

|参数名|必须|备注|
|:-|:-|:-|
|code|是|临时登录凭证|

返回:

|参数名|说明|
|:-|:-|
|sess|~~拒绝吐槽我的英语~~<br>这个会在成功时返回true<br>但是在失败时不存在|
|session_cookie|只会在成功时返回<br>用于和服务器交互的身份验证|
|error|只会在失败时返回<br>这个是微信给的错误代码,这里原封不动抄下来|
|errmsg|同上|

##### 样例
请求:

GET https://example.com/api/login?code=asdfasdfasdf

返回:

成功时

```JSON
{
    "sess":true,
    "session_cookie":"b985d1e102df52d8332aeb7b4655295b"
}
```
失败时
```JSON
{
    "error":40029,
    "errmsg":"invalid code"
}
```
#### getFileList
##### 说明

地址: /api/getFileList

调用: POST

说明: 用于获取用户/群组下的文件清单

|参数名|必须|备注|
|:-|:-|:-|
|session_cookie|是|login得到的cookie|
|openGid|否|当前群组的openGid<br>如果传这个参数则获取对应群的文件列表|
|first|否|暂时废弃,随便给个整数就行<br>目的是为了分部分加载|
|num|否|同上|

返回:

|参数名|说明|
|:-|:-|
|success|一个布尔值<br>true:请求成功<br>false:请求失败|
|error|只在出错时返回<br>错误信息|
|empty|只在成功时返回<br>文件列表是否为空|
|files|文件列表 是个list 具体元素格式见下表|

files里的元素:

|成员|说明|
|:-|:-|
|file_id|文件的ID<br>~~我懒得加密了,就直接用mongodb里的id了~~|
|name|文件名|
|type|文件类型 是文件后缀<br>例如: docx xlsx xls txt 等|
|upload_time|根据~~打成~~共识 这里直接返回东八区时间的yy-MM-dd hh:mm格式|

##### 样例
请求:

POST https://example.com/api/getFileList

session_cookie=YOUR SESSION COOKIE

返回:

成功时

```JSON
{
    "success": true,
    "empty": false,
    "files":[
        {
            "file_id": "文件的ID",
            "name": "文件名",
            "type": "文件类型",
            "upload_time": "上传时间"
        }
    ]
}
```

失败时

```JSON
{
    "success": false,
    "error": "cookie过期，请重试"
}
```
#### openShare
地址: /api/openShare

调用: POST

说明: 在分享到群组的文件被打开始,调用用以获得详细文件信息,并将文件添加到用户和群组列表

|参数名|必须|备注|
|:-|:-|:-|
|session_cookie|是|login得到的cookie|
|openGid|是|从一个微信给的API拿到的|
|file_id|是|文件的id|

返回:

|参数名|说明|
|:-|:-|
|success|true:成功<br>false:失败|
|file|一个file对象 具体定义看下表|
|error|只在失败时返回<br>错误信息|

file对象(跟上面那个基本一样 更详细)

|成员|说明|
|:-|:-|
|file_id|文件的ID<br>我不嫌烦,再传一下|
|name|文件名|
|upload_time|文件的上传时间 格式:yy-MM-dd hh:mm|
|type|文件类型|
|size|文件大小已经自带单位,直接显示来就好 单位: B KB MB 小数点后两位精度|
|download_num|下载人数|

PS: 可能以后会加上几个下载人的头像
##### 样例
请求:

POST https://example.com/api/openShare

session_cookie=我是cookie&openGid=我是openGid&file_id=我是文件id

返回:

成功时:

```JSON
{
    "success": true,
    "file": {
        "file_id": "THE FILE ID",
        "name": "THE FILE NAME",
        "upload_time": "",
        "type": "",
        "size": "KB",
        "download_num": 10
    }
}
```

失败时:

```JSON
{
    "success":false,
    "error":"cookie过期，请重试"
}
```
#### getFileInfo
##### 说明
地址: /api/getFileInfo

调用: POST

说明: 通过file_id得到详细的文件信息

|参数名|必须|备注|
|:-|:-|:-|
|session_cookie|是|login得到的cookie|
|file_id|是|文件的id|

返回: 

我跟你说跟上面的一样 你会打我么? (逃

#### upload
##### 说明
地址: /api/upload

调用: POST-multipart

说明: 暂时没写完,写完再更