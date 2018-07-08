// pages/details/details.js
//import regeneratorRuntime from "../../utils/runtime.js"
import utils from "../../utils/util.js"
const app = getApp()
var file = {
  id: null,
  name: null,
  url: null,
  type: null,
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    downloaded: false,
    downloading: false,
    winHeight: null,
    windowWidth: null,
    type: null,
    percent: 0,
    id: null,
    time: null,
    name: null,
    loaded: false,
    fromShare: false,
    error: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var loginStatusCallbackLock = false;
    var shareTicketCallbackLock = false;
    //  高度自适应
    wx.getSystemInfo({
      success: function(res) {
        var calc = res.windowHeight
        console.log(calc)
        let windowWidth = res.windowWidth;
        that.setData({
          winHeight: calc,
          windowWidth: windowWidth
        });
      }
    });
    app.loginStatusCallback = () => {
      if (loginStatusCallbackLock) {
        return;
      }
      loginStatusCallbackLock = true;
      wx.request({
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
            file.name = res.data.file.name
            file.type = res.data.file.type
          } else {
            this.setData({
              error: true
            })
            console.log(res)
          }
        }
      })
    }
    app.shareTicketCallback = (sTicket) => {
      if (shareTicketCallbackLock) {
        return;
      }
      shareTicketCallbackLock = true;
      loginStatusCallbackLock = true;
      console.log(sTicket);
      wx.getShareInfo({
        shareTicket: app.globalData.shareTicket,
        success: res => {
          console.log(res);
          wx.request({
            url: 'https://asdf.zhr1999.club/api/openShare',
            method: 'POST',
            data: {
              session_cookie: app.globalData.cookie,
              file_id: options.id,
              encryptedData: res.encryptedData,
              vi: res.iv
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
                file.name = res.data.file.name
                file.type = res.data.file.type
              } else
                this.setData({
                  error: true
                })
              console.log(res)
            }
          })
        }
      })
    }
    if (getCurrentPages().length == 1) {
      this.setData({
        fromShare: true
      });
      app.shareTicketCallback(app.globalData.shareTicket);
    } else {
      app.loginStatusCallback();
    }
  },
  onShareAppMessage: (res) => {
    wx.showShareMenu({
      withShareTicket: true
    });
    return {
      title: '我给你分享了文件' + file.name + ',快来看看吧!',
      path: '/pages/details/details?id=' + file.id + "&type=" + file.type + "&name=" + file.name + "&time=" + file.time,
      imageUrl: 'https://asdf.zhr1999.club/resource/pngs/' + file.type + '.png',
      success(res) {
        wx.showShareMenu({
          withShareTicket: true,
        })
      }
    }
  },
  download: function() {
    const downloadTask = wx.downloadFile({
      url: 'https://asdf.zhr1999.club/api/download?session_cookie=' + app.globalData.cookie + "&file_id=" + file.id,
      success: res => {
        console.log(res)
        this.setData({
          downloading: false,
          downloaded: true
        })
        if (res.statusCode) {
          file.url = res.tempFilePath
        }
      },
    })
    downloadTask.onProgressUpdate((res) => {
      this.setData({
        downloading: true,
        percent: res.progress
      })
    })
  },
  goBack: () => {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  open: () => {
    console.log(file)
    wx.openDocument({
      filePath: file.url,
      fileType: file.type
    })
  },
  bindanimationfinish: function(e) {
    this.goBack();
  }
})