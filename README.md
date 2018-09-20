# Groupfile
## 一、诞生背景
随着微信的用户群不断扩大，越来越多的学校，单位将微信群作为了通知的一种手段，我们常常会需要在微信群之间共享、下载文件。然而，微信群对于文件的保存采用的是聊天记录的方式，经常我们会面临急需某个文件，但是文件却过期了的窘境。此外，用户遇到更换手机、恢复出厂设置等丢失微信聊天记录的情况时，所保存的聊天文件也会永久丢失。甚至一段时间没有打开微信，错过了相应消息的发送都会导致文件的错失。
为此，小程序“群文件分享”应运而生了。我们的小程序致力于在云端保存文件，不将文件保存至手机，关闭小程序后下载文件将自动删除，避免了无谓的空间占用。并且根据群组对文件进行分类，按时间对文件进行排序，帮助用户更快的找到自己需要的文件。同时也方便了文件的分享。
## 二、实现思路
服务器环境如下：
- Mongodb v3.6.5
- Node.js v9.11.1

数据库中共有 4张表，分别用于存放：用户信息，群组信息，文件信息，权限验证信息。在任何请求数据的操作，我们都会对每一个参数进行权限检测，判断请求的合法性。当用户点击一个被分享到群组的文件之后，我们先验证用户的登录状态，并解析群组的openGid，只有解析成功我们才会将这个文件添加到对应的群组列表和用户的文件列表，否则直接返回错误信息。在平时的文件请求中我们也会进行权限的校验，保证用户信息安全。
考虑到目前大部分的文件上传都是在微信电脑版上完成的，加.之小程序的限制。我们便采用了“小程序扫码登录+网页上传文件”的方式。在浏览器打开：~~https://asdf.zhr1999.club~~（域名过期） ，使用小程序扫码即可对文件进行管理。
考虑到需要两个客户端（网页版，小程序）故采用前后端分离的服务架构，提高API复用，降低维护成本。所有的API都在统一的路径下/api/，前端使用vue.js实现以达成和小程序的api复用。在整个业务流程的设计上，完全按照微信所倡导的数据安全进行设计，敏感信息不下发、采用单独的session_cookie作为通信的凭证。所有涉及到用户隐私的操作都先行进行权限认证。由于目前成本的限制，我们暂时采用了本地文件存储的方式，但考虑到未来可能的大量文件存取，本地文件保存肯定不是正确的处理方式，因此我们将文件IO做成一个模块，并使用统一url命名为之后升级到的更优的文件存储方式（目标存储，加密存储等）提供可能。为保护用户隐私，我们的文件名在所有的存储结构中都是随机hash的形式，唯有在数据库中查到对应关系才能解析，同时可以使用运用哈希查找以提高文件的检索速度。
小程序采用最新的ES6标准进行编写，大大提高代码可读性，同时便于管理大量的异步操作，提高程序的执行效率。
小程序端在过程中使用Websocket代替轮询机制，降低网络资源消耗，提升用户体验。

## 三、后端

API一览请看[这里](https://github.com/Gaojianli/Groupfile/blob/master/servers/README.md)
部署方法:
```bash
git clone https://github.com/Gaojianli/Groupfile.git
cd servers
npm install
node app.js
```
