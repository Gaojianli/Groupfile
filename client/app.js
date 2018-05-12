//app.js
App({
  loginStatus: false,
  errReason: "",
  //错误退出实现
  quitFlag: false,

  onLaunch: function () {
    // 登录
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
              }
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
          loginStatus: false
        }
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    }),
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
    userInfo: null
  }
})