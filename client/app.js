//app.js
App({
  errReason: "",
  //错误退出实现
  quitFlag: false,

  onLaunch: function (opt) {
    if (opt.scene == 1044) {
      app.globalData.shareTicket = opt.shareTicket
    }
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
      }
    })
  },
  globalData: {
    userInfo: null,
    cookie: null,
    loginStatus: false,
    shareTicket: null
  }
})
