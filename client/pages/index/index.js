//index.js
//获取应用实例
const app = getApp()
var util = require("../../utils/util.js")
import regeneratorRuntime from "../../utils/runtime.js"
Page({
  data: {
    userInfo: "",
    loginStatus: false,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    filelist: {
      empty: true,
      data: []
    }
  },
  //事件处理函数
  onLoad: async function () {
    wx.showLoading({
      title: '加载中',
    })
    //
    //获取用户信息
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    if (!app.globalData.loginStatus) {
      await checkLoginStatus(this);
      if (app.globalData.loginStatus == false) {
        wx.showToast({
          title: '登录失败！',
          icon: 'loading',
          duration: 1500,
          success: () => {
            // wx.reLaunch({
            //   url: '../pages/exit/exit',
            // })
            console.log("退出");
          }
        })
      }
      await getFileList(app.globalData.cookie, this);
      wx.hideLoading()
    }
    else {
      await getFileList(app.globalData.cookie, this);
      wx.hideLoading()
    }
    //获取文件列表
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  showDetails: (e) => {
    wx.navigateTo({
      url: '/pages/details/details?id=' + e.currentTarget.dataset.id,
    })
  }
})

const getFileList = (cookie, that, start, num) => {
  return new Promise(resolve => {
    if (!app.globalData.loginStatus)
      return
    else {
      if (!start)
        start = 0
      else if (!num)
        num = 10
      wx.request({
        url: 'https://asdf.zhr1999.club/api/getFileList',
        data: {
          session_cookie: cookie,
          first: start,
          num: 10
        },
        method: "POST",
        success: res => {
          if (res.data.success && !res.data.empty) {
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
              filelist: {
                empty: false,
                data: fileList
              }
            })
          }
        }
      })
    }
    resolve(true);
  })
}

let checkLoginStatus = (that) => {
  return new Promise(res => {
    if (app.globalData.loginStatus)
      that.setData({
        loginStatus: true
      })
    else
      that.setData({
        loginStatus: false
      })
  })
}