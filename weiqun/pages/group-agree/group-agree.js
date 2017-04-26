var WxParse = require('../../public/wxParse/wxParse.js')
Page({
  data: {
    title: '',
    content: ''
  },
  onLoad: function (options) {
    var _this = this
    console.log('Page Load')
    _this.initAgree()
  },
  onReady: function () {
    var _this = this
    console.log('Page Ready')
  },
  onShow: function () {
    var _this = this
    console.log('Page Show')
  },
  onHide: function () {
    var _this = this
    console.log('Page Hide')
  },
  onUnload: function () {
    var _this = this
    console.log('Page Unload')
  },
  onPullDownRefresh: function () {
    var _this = this
    console.log('Page PullDownRefresh')
    wx.stopPullDownRefresh()
  },
  onReachBottom: function () {
    var _this = this
    console.log('Page ReachBottom')
  },
  initAgree: function () {
    var _this = this
    wx.request({
      method: 'POST',
      url: getApp().data.serverUrl + 'bxwxsvr/BX_UNI_SERVICE.json',
      data: {
        operflag: 'queryforumrule'
      },
      success: function (res) {
        if (res.data && res.data.ruleDetail && res.data.ruleDetail.length) {
          var src = res.data.ruleDetail
          _this.setData({
            'title': src[0].title || '微群搜索运营规范',
            'content': src[0].ruledesc ? WxParse.wxParse('content', 'html', src[0].ruledesc, _this, 5) : ''
          })
        } else {
          _this.setData({
            'title': '微群搜索运营规范',
            'content': ''
          })
        }
      },
      fail: function (err) {
        _this.setData({
          'title': '微群搜索运营规范',
          'content': ''
        })
      }
    })
  }
})