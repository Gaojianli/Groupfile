//app.js
//import regeneratorRuntime from "utils/runtime.js"
import utils from "utils/util.js"
App({
  errReason: "",
  //错误退出实现
  quitFlag: false,

  onShow: function(opt) {
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
    new Promise((rec, rej) => {
        let value = wx.getStorageSync('cookie')
        if (value.length == 32) {
          wx.checkSession({
            success: () => {
              this.globalData.cookie = value;
              this.globalData.loginStatus = true;
              rec(false);
            },
            fail: () => {
              rec(true);
            }
          })
        } else {
          rec(true)
        }
      })
      .then((needReload) => {
        if (needReload) {
          return utils.loginCus(this)
        } else {
          return true;
        }
      })
      .then((loginSuccess) => {
        if (opt.scene == 1044) {
          this.globalData.shareTicket = opt.shareTicket
          if (this.shareTicketCallback) {
            this.shareTicketCallback(this.globalData.shareTicket);
          }
        }
        if (this.loginStatusCallback) {
          this.loginStatusCallback(loginSuccess);
        }
      })
      .catch(err => {console.error(err)});
  },
  globalData: {
    userInfo: null,
    cookie: null,
    loginStatus: false,
    shareTicket: null,
    winHeight: null,
    showHelpStatus: false
  }
})