//app.js
App({
  errReason: "",
  //错误退出实现
  quitFlag: false,

  onLaunch: function () {
    // 登录
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.globalData.userInfo = res.userInfo
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
        else{
          loginCus()
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    cookie:null,
    loginStatus:false
  }
})
