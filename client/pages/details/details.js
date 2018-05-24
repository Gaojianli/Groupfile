// pages/details/details.js
import regeneratorRuntime from "../../utils/runtime.js"
import utils from "../../utils/util.js"
const app = getApp()
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
  onLoad: async function (options) {
    if (!app.globalData.loginStatus)
      await utils.loginCus(app)
    wx.request({
      url: 'https://asdf.zhr1999.club/api/getFileInfo',
      method: "POST",
      data: {
        session_cookie: app.globalData.cookie,
        file_id: options.id
      },
      success: res => {
        console.log(res)
        if (res.statusCode==200) {
          this.setData({
            type: options.type,
            id: options.id,
            time: options.time,
            name: options.name,
            loaded: true
          })
        }
        else
          console.error(res)
      }
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