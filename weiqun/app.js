App({
  data: {
    appId: require('./public/config').appId || '',
    appSecret: require('./public/config').appSecret || '',
    serverUrl: require('./public/config').serverUrl || '',
    userId: '',
    userInfo: null,
    geoLocation: null
  },
  onLaunch: function (options) {
    var _this = this
    console.log('App Launch')
  },
  onShow: function (options) {
    var _this = this
    console.log('App Show')
  },
  onHide: function () {
    var _this = this
    console.log('App Hide')
  },
  onError: function (error) {
    var _this = this
    console.log('App Error')
  },
  getUserId: function (fn) {
    var _this = this
    if (typeof fn !== 'function') return
    if (_this.data.userId) {
      fn(_this.data.userId)
    } else {
      wx.showToast({ icon: 'loading', title: '登录中...', duration: 1000 })
      wx.login({
        success: function (res) {
          if (res.code) {
            wx.request({
              url: 'https://api.weixin.qq.com/sns/jscode2session',
              data: {
                appid: _this.data.appId,
                secret: _this.data.appSecret,
                js_code: res.code,
                grant_type: 'authorization_code'
              },
              success: function (res) {
                _this.data.userId = res.data.openid || ''
                fn(_this.data.userId)
              },
              fail: function (err) {
                fn(_this.data.userId)
              }
            })
          } else {
            fn(_this.data.userId)
          }
        },
        fail: function (err) {
          fn(_this.data.userId)
        }
      })
    }
  },
  getUserInfo: function (fn) {
    var _this = this
    if (typeof fn !== 'function') return
    if (_this.data.userInfo) {
      fn(_this.data.userInfo)
    } else {
      wx.showToast({ icon: 'loading', title: '登录中...', duration: 1000 })
      wx.login({
        success: function (res) {
          if (res.code) {
            wx.getUserInfo({
              success: function (res) {
                _this.data.userInfo = res.userInfo || null
                fn(_this.data.userInfo)
              },
              fail: function (err) {
                fn(_this.data.userInfo)
              }
            })
          } else {
            fn(_this.data.userInfo)
          }
        },
        fail: function (err) {
          fn(_this.data.userInfo)
        }
      })
    }
  },
  getGeoLocation: function (fn) {
    var _this = this
    if (typeof fn !== 'function') return
    if (_this.data.geoLocation) {
      fn(_this.data.geoLocation)
    } else {
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          if (res.latitude && res.longitude) {
            var geo = {}
            geo.latitude = res.latitude
            geo.longitude = res.longitude
            geo.speed = res.speed
            geo.accuracy = res.accuracy
            wx.request({
              method: 'POST',
              url: _this.data.serverUrl + 'bxwxsvr/BX_UNI_SERVICE.json',
              data: {
                operflag: 'querycurcity',
                lats: geo.latitude,
                lngs: geo.longitude
              },
              success: function (res) {
                if (res.data && res.data.curcity) {
                  geo.cityid = res.data.curcity.cityid || ''
                  geo.cityname = res.data.curcity.cityname || ''
                  geo.provinceid = res.data.curcity.provinceid || ''
                  geo.provincename = res.data.curcity.provincename || ''
                  geo.address = res.data.curcity.address || ''
                  _this.data.geoLocation = geo
                  fn(_this.data.geoLocation)
                } else {
                  fn(_this.data.geoLocation)
                }
              },
              fail: function (err) {
                fn(_this.data.geoLocation)
              }
            })
          } else {
            fn(_this.data.geoLocation)
          }
        },
        fail: function (err) {
          fn(_this.data.geoLocation)
        }
      })
    }
  }
})