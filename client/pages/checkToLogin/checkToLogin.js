// pages/checkToLogin/checkToLogin.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    winHeight: null,
    webSession: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      hasUserInfo: app.globalData.userInfo ? true : false,
      winHeight: app.globalData.winHeight,
      webSession: options.session
    })
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    wx.request({
      url: 'https://asdf.zhr1999.club/api/completeInfo',
      data: {
        session_cookie: app.globalData.cookie,
        encryptedData: e.detail.encryptedData,
        vi: e.detail.iv
      },
      method: "POST",
      success: (rec) => {
        if (rec.data.success) {
          this.loginWeb();
        } else {
          wx.showToast({
            title: rec.data.error ? rec.data.error : '服务器繁忙，请重试。',
            icon: 'none',
            duration: 2000,
            mask: true,
            success: () => {
              setTimeout(this.goBack, 2000);
            }
          })
        }
      }
    })
    this.setData({
      hasUserInfo: true
    })
  },
  loginWeb: function (e) {
    wx.request({
      url: 'https://asdf.zhr1999.club/api/scanCode',
      data: {
        session_cookie: app.globalData.cookie,
        web_session_cookie: this.data.webSession
      },
      method: "GET",
      success: (rec) => {
        if (rec.data.success) {
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 1000,
            mask: true,
            success: () => {
              setTimeout(this.goBack, 1000);
            }
          })
        } else {
          wx.showToast({
            title: rec.data.error ? rec.data.error : '服务器繁忙，请重试。',
            icon: 'none',
            duration: 2000,
            mask: true,
            success: () => {
              setTimeout(this.goBack, 2000);
            }
          })
        }
      }
    })
  },
  goBack: () => {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  }
})