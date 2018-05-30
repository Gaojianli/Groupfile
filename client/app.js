//app.js
import regeneratorRuntime from "utils/runtime.js"
import utils from "utils/util.js"
App({
  errReason: "",
  //错误退出实现
  quitFlag: false,

  onShow: async function (opt) {
    console.log(opt.scene);
    if (!this.globalData.loginStatus)
      await utils.loginCus(this)
    if (this.loginStatusCallback) {
      this.loginStatusCallback(this.globalData.loginStatus);
    }
    if (opt.scene == 1044) {
      this.globalData.shareTicket = opt.shareTicket
      if (this.shareTicketCallback) {
        this.shareTicketCallback(this.globalData.shareTicket);
      }
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