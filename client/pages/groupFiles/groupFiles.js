//index.js
//获取应用实例
const app = getApp()
var util = require("../../utils/util.js")
//import regeneratorRuntime from "../../utils/runtime.js"
Page({
  data: {
    openGid: "",
    filelist: {
      empty: true,
      data: []
    }
  },
  //事件处理函数
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      openGid: options.id
    })
    getFileList(this.data.openGid, app.globalData.cookie, this)
    .then(()=>{
      wx.hideLoading()
    })
  },
  showDetails: (e) => {
    wx.navigateTo({
      url: '/pages/details/details?id=' + e.currentTarget.dataset.id,
    })
  }
})

const getFileList = (openGid, cookie, that, start, num) => {
  return new Promise(resolve => {
    if (!start)
      start = 0
    if (!num)
      num = 10
    wx.request({
      url: 'https://asdf.zhr1999.club/api/getFileList',
      data: {
        session_cookie: cookie,
        openGid: openGid,
        first: start,
        num: 10
      },
      method: "POST",
      success: res => {
        console.log(res);
        if (res.data.success) {
          let fileList = [];
          for (let i of res.data.files) {
            let data = {};
            data.fileName = i.name
            data.uploadTime = i.upload_time
            data.type = i.type
            data.id = i._id
            fileList.push(data);
          }
          that.setData({
            "filelist.empty": res.data.empty,
            "filelist.data": fileList
          })
        }
        resolve();
      }
    })
  })
}
