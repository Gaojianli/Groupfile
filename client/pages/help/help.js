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
  checkboxChange: function(e){
    this.setData({
      neverShowCheck: this.data.neverShowCheck?false:true
    })
  },
  goScan: function(e){
    wx.setStorageSync("neverHelp", this.data.neverShowCheck);
    wx.scanCode({
      scanType: 'qrCode',
      success: (res) => {
        let strs = res.result.split("=");
        if (strs[0] == "https://asdf.zhr1999.club/api/scanCode?cookie") {
          wx.navigateTo({
            url: '/pages/checkToLogin/checkToLogin?session=' + strs[1],
          })
        } else {
          wx.showToast({
            title: '二维码无效',
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
})