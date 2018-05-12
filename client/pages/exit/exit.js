// pages/exit/exit.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  onLoad: function (options) {
    if (app.quitFlag){
      if (app.globalData.flag) {
        //如果flag为true，退出  
        wx.navigateBack({
          delta: 1
        })
      }
    }
  }
})