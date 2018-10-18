// pages/help/help.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    neverShowCheck: true,
    winHeight: null,
    webSession: null,
  },
  checkboxChange: function (e) {
    this.setData({
      neverShowCheck: this.data.neverShowCheck ? false : true
    })
  },
  goScan: function (e) {
    wx.setStorageSync("neverHelp", this.data.neverShowCheck);
    wx.scanCode({
      scanType: 'qrCode',
      success: (res) => {
        let strs = res.result.split("=");
        if (strs[0] == "https://groupfile.xice.wang/api/scanCode?cookie") {
          wx.navigateTo({
            url: '/pages/checkToLogin/checkToLogin?session=' + strs[1],
          })
        } else {
          wx.showModal({
            title: '二维码无效',
            content: '请扫描指定的二维码才能登录',
            showCancel: false,
            confirmText: "知道了"
          })
        }
        console.log(res)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      winHeight: app.globalData.winHeight,
    })
  },
})