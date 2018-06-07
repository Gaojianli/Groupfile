const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const loginCus = (app) => {
  return new Promise((resolve) => {
    try {
      var value = wx.getStorageSync('cookie')
      wx.checkSession({
        success: () => {
          app.globalData.cookie = value
          app.globalData.loginStatus = true
          resolve(true);
        },
        complete: () => {
          if (value == "")
            wx.login({
              success: res => {
                if (res.code) {
                  wx.request({
                    url: 'https://asdf.zhr1999.club/api/login',
                    data: {
                      code: res.code
                    },
                    method: "GET",
                    success: res => {
                      console.log(res)
                      if (res) {
                        app.globalData.cookie = res.data.session_cookie
                        app.globalData.loginStatus = true
                        wx.setStorage({
                          key: "cookie",
                          data: res.data.session_cookie
                        })
                      }
                      resolve(true);
                    }
                  })
                } else {
                  console.log('登录失败！' + res.errMsg)
                  app.globalData.loginStatus = false
                  resolve(false);
                }
              }
            })
        }
      })
    } catch (e) {
      console.log(e);
    }
  })
}

module.exports = {
  formatTime: formatTime,
  loginCus: loginCus
}
