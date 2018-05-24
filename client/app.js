//app.js
import regeneratorRuntime from "utils/runtime.js"
import utils from "utils/util.js"
App({
  errReason: "",
  //错误退出实现
  quitFlag: false,

  onLaunch:async function (opt) {
    if (!this.globalData.loginStatus)
      await utils.loginCus(this)
    if (opt.scene == 1044) {
      this.globalData.shareTicket = opt.shareTicket
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