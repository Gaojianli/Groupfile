var app = getApp();
var windowWidth = 0; //窗口宽度
var util = require("../../utils/util.js")
import regeneratorRuntime from "../../utils/runtime.js"
Page({
  data: {
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    refreshHeight: -50,
    refreshing: false,
    userInfo: "",
    loginStatus: false,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    filelist: {
      empty: true,
      loaded: false,
      data: []
    },
    groupList: {
      empty: true,
      loaded: false,
      group: []
    }
  },
  // 滚动切换标签样式
  switchTab: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.checkCor();
    loadThePage(this);
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) { return false; }
    else {
      this.setData({
        currentTab: cur
      })
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  onLoad: async function () {
    var that = this;
    //  高度自适应
    await new Promise((rec, rej) => {
      wx.getSystemInfo({
        success: function (res) {
          var calc = res.windowHeight - res.windowWidth / 750 * 90
          console.log(calc)
          windowWidth = res.windowWidth;
          that.setData({
            winHeight: calc
          });
          app.globalData.winHeight = calc;
          rec(true);
        }
      });
    })
    wx.showLoading({
      title: '加载中',
    })
    app.loginStatusCallback = async (token) => {
      //
      //获取用户信息
      if (app.globalData.userInfo) {
        this.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true
        })
      } else if (this.data.canIUse) {
        app.userInfoReadyCallback = res => {
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      } else {
        wx.getUserInfo({
          success: res => {
            app.globalData.userInfo = res.userInfo
            this.setData({
              userInfo: res.userInfo,
              hasUserInfo: true
            })
          }
        })
      }
      await checkLoginStatus(this);
      if (!app.globalData.loginStatus) {
        wx.showToast({
          title: '登录失败！',
          icon: 'loading',
          duration: 1500,
          success: () => {
            // wx.reLaunch({
            //   url: '../pages/exit/exit',
            // })
            console.log("退出");
          }
        })
        await getFileList(app.globalData.cookie, this);
        wx.hideLoading()
        wx.stopPullDownRefresh();
      }
      else {
        await getFileList(app.globalData.cookie, this);
        wx.hideLoading()
        wx.stopPullDownRefresh();
      }
      //获取文件列表
    }
    if (app.globalData.cookie) {
      app.loginStatusCallback(app.globalData.cookie);
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  showDetails: function (e) {
    if (this.data.currentTab == 1) {
      wx.navigateTo({
        url: '/pages/groupFiles/groupFiles?id=' + e.currentTarget.dataset.id,
      })
    } else {
      wx.navigateTo({
        url: '/pages/details/details?id=' + e.currentTarget.dataset.id,
      })
    }
  },
  footerTap: app.footerTap,
  toUpperLoad: async function (e) {
    var that = this
    if (that.data.refreshing) return
    that.setData({ refreshing: true })
    let downPromise = fullDownTheLoad(this,200,'down')
    let reloadPromise = null;
    //刷新请求
    if (this.data.currentTab == 0) {
      reloadPromise = getFileList(app.globalData.cookie, this);
    }else{
      reloadPromise = new Promise((rec)=>{
        wx.request({
          url: 'https://asdf.zhr1999.club/api/getGroupList',
          method: 'POST',
          data: {
            session_cookie: app.globalData.cookie
          },
          success: res => {
            console.log(res);
            let groupList = [];
            for (let i of res.data.group_list) {
              let openGidList = {
                id: i
              }
              groupList.push(openGidList);
            }
            this.setData({
              "groupList.empty": res.data.num ? false : true,
              "groupList.group": groupList,
              "groupList.loaded": true
            });
            rec(true);
          }
        })
      })
    }
    await Promise.all([downPromise,reloadPromise]);
    await fullDownTheLoad(this, 200, 'up');
  },
  scanCode: function(e){
    wx.scanCode({
      scanType: 'qrCode',
      success: (res) => {
        let strs = res.result.split("=");
        if (strs[0]=="https://asdf.zhr1999.club/api/scanCode?cookie"){
          wx.navigateTo({
            url: '/pages/checkToLogin/checkToLogin?session=' + strs[1],
          })
        }else{
          wx.showToast({
            title: '二维码错误',
          })
        }
        console.log(res)
      }
    })
  }
})
app.groupOnLoadFunc = (that) => {
  wx.showLoading({
    title: '加载中',
  })
  wx.request({
    url: 'https://asdf.zhr1999.club/api/getGroupList',
    method: 'POST',
    data: {
      session_cookie: app.globalData.cookie
    },
    success: res => {
      console.log(res);
      let groupList = [];
      for (let i of res.data.group_list) {
        let openGidList = {
          id: i
        }
        groupList.push(openGidList);
      }
      that.setData({
        "groupList.empty": res.data.num ? false : true,
        "groupList.group": groupList,
        "groupList.loaded": true
      });
      wx.hideLoading();
      wx.stopPullDownRefresh();
    }
  })
}
const getFileList = (cookie, that, start, num) => {
  return new Promise(resolve => {
    if (!app.globalData.loginStatus) {
      resolve(false);
    } else {
      if (!start)
        start = 0
      if (!num)
        num = 10
      wx.request({
        url: 'https://asdf.zhr1999.club/api/getFileList',
        data: {
          session_cookie: cookie,
          first: start,
          num: 10
        },
        method: "POST",
        success: res => {
          if (res.data.success && !res.data.empty) {
            let fileList = [];
            for (let i of res.data.files) {
              let data = {};
              data.fileName = i.name
              data.uploadTime = i.upload_time
              data.type = i.type
              data.id = i._id
              fileList.push(data);
            }
            let isOut = false;
            if (windowWidth / 750 * 205 * fileList.length >= that.data.winHeight) {
              isOut = true;
            }
            that.setData({
              "filelist.empty": false,
              "filelist.data": fileList,
              "filelist.loaded": true,
              isFileListOut: isOut
            })
          }
        }
      })
      resolve(true);
    }
  })
}

let checkLoginStatus = (that) => {
  return new Promise(res => {
    if (app.globalData.loginStatus)
      that.setData({
        loginStatus: true
      })
    else
      that.setData({
        loginStatus: false
      })
    res(app.globalData.loginStatus);
  })
}
const loadThePage = (that) => {
  if (that.data.currentTab == 0) {
    if (!that.data.filelist.loaded) {
      wx.showLoading({
        title: '加载中',
      })
      getFileList(app.globalData.cookie, that);
    }
  } else {
    if (!that.data.groupList.loaded) {
      app.groupOnLoadFunc(that)
    }
  }
}
const fullDownTheLoad = (that, time, type) => {
  let sleep = new Promise((rec) => {
    setTimeout(rec, 1);
  })
  return new Promise(async (rec) => {
    let now = 0;
    while (now == time) {
      if (type == 'down') {
        that.setData({
          refreshHeight: 50 * (1 - 2 * (now / time - 1) * (now / time - 1))
        })
      }else{
        that.setData({
          refreshHeight: 50 * (1 - 2 * (now / time) * (now / time))
        })
      }
      await sleep;
      now++;
    }
    rec(true);
  })
}