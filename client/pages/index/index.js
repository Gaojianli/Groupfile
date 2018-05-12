//index.js
//获取应用实例
const app = getApp()
var util = require("../../utils/util.js")
import regeneratorRuntime from "../../utils/runtime.js"
Page({
  data: {
    userInfo: {},
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
    this.setData({
      filelist: {
        empty: false,
        data: [
          {
            id: 1,
            fileName: "我是文件名",
            uploadTime: "2018-2-3 15：32"
          },
          {
            id: 2,
            fileName: "我是文件二号",
            uploadTime: "time"
          }
        ]
      }
    })
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
    if (!app.loginStatus) {
      await loginCus(this);
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
    else{

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
})

const loginCus = (that) => {
  return new Promise(resolve => {
    wx.login({
      success: res => {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'https://asdf.zhr1999.club/api/login',
            data: {
              code: res.code
            },
            method: "GET",
            success: res => {
              if (res) {
                console.log(res.data)
                that.setData({
                  loginStatus: true,
                })
                console.log(that);
              }
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
          loginStatus: false
        }
      }
    })
  })
}

const getFileList=async cookie=>{
  
}