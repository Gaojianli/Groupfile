// pages/details/details.js
import regeneratorRuntime from "../../utils/runtime.js"
import utils from "../../utils/util.js"
const app = getApp()
var file = {
  id: null,
  url: null,
  type:null
}
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
    await wx.request({
      url: 'https://asdf.zhr1999.club/api/getFileInfo',
      method: "POST",
      data: {
        session_cookie: app.globalData.cookie,
        file_id: options.id
      },
      success: res => {
        if (res.data.success) {
          this.setData({
            type: res.data.file.type,
            id: options.id,
            time: res.data.file.upload_time,
            name: res.data.file.name,
            loaded: true
          })
          file.id = options.id
          file.type = res.data.file.type
        }
        else
          console.error(res)
      }
    })
    if (app.globalData.shareTicket)
      wx.getShareInfo({
        shareTicket: app.globalData.shareTicket,
        success(res) {
          wx.request({
            url: 'https://asdf.zhr1999.club/api/openShare',
            method: 'POST',
            data: {
              session_cookie: app.globalData.cookie,
              file_id: options.id,
              encryptedData: res.encryptedData,
              vi: res.iv
            },
            success(res) {
              console.log(res)
            }
          })
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
  download: async function(){
    await wx.downloadFile({
      url: 'https://asdf.zhr1999.club/api/download?session_cookie=' + app.globalData.cookie + "&file_id=" + file.id,
      success: res => {
        console.log(res)
        if (res.statusCode) {
          file.url = res.tempFilePath
        }
      },
    })
    this.setData({
      downloaded: true
    })
  },
  open: () => {
    console.log(file)
    wx.openDocument({
      filePath: file.url,
      fileType:file.type
    })
  }
})