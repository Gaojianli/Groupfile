//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    filelist:{
      empty:true,
      data:[]
    }
  },
  //事件处理函数
  onLoad: function () {
    if(!app.loginStatus)
    {
      wx.showToast({
        title: '登录失败！',
        icon: 'loading',
        duration: 1500,
        success:()=>{
           // wx.reLaunch({
          //   url: '../pages/exit/exit',
          // })
          console.log("退出");
        }
      })
    }
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
    //获取文件列表
    this.setData({
      filelist:{
        empty:false,
        data:[
          {
            id:1,
            fileName:"我是文件名",
            uploadTime:"2018-2-3 15：32"
          },
          {
            id:2,
            fileName:"我是文件二号",
            uploadTime:"time"
          }
        ]
      }
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
})
