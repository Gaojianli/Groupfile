// pages/details/details.js
import regeneratorRuntime from "../../utils/runtime.js"
var file = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    downloaded: false,
    type: null,
    id: null,
    time: null,
    name: null,
    loaded: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    file = options
    this.setData({
      type: options.type,
      id: options.id,
      time: options.time,
      name: options.name,
      loaded: true
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
  onShareAppMessage: (res) => {
    return {
      title: '我给你分享了文件' + file.name + ',快来看看吧!',
      path: '/pages/details/details?id=' + file.id + "&type=" + file.type + "&name=" + file.name + "&time=" + file.time,
      imageUrl: 'https://asdf.zhr1999.club/resource/icons/' + file.type + '.svg',
      success(res) {
        wx.showShareMenu({
          withShareTicket: true,
        })
      }
    }
  },
  download: function () {
    this.setData({
      downloaded: true
    })
  }
})