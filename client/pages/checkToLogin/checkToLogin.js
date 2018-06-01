// pages/checkToLogin/checkToLogin.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight:null,
    webSession: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      winHeight: app.globalData.winHeight,
      webSession: options.session
    })
  },
  loginWeb: function(e){
    wx.request({
      url: 'https://asdf.zhr1999.club/api/scanCode',
      data: {
        session_cookie: app.globalData.cookie,
        web_session_cookie: this.data.webSession
      },
      method: "GET",
      success: (rec)=>{
        if(rec.data.success){
          wx.showToast({
            title: '登陆成功',
            icon: 'success',
            duration: 1000,
            mask: true,
            success: ()=>{
              setTimeout(this.goBack,1000);
            }
          })
        }else{
          wx.showToast({
            title: rec.data.error ? rec.data.error:'服务器繁忙，请重试。',
            icon:'none',
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
  goBack: ()=>{
    wx.navigateBack({
      delta: 1
    })
  }
})