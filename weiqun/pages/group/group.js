Page({
  data: {
    user: { enabled: false, openid: '', avatar: '../../images/icon-search-1.jpg', name: '' },
    list: { items: [], hasnone: false },
    prompt: { enabled: false, image: '', caption: '' }
  },
  onLoad: function (options) {
    var _this = this
    console.log('Page Load')
  },
  onReady: function () {
    var _this = this
    console.log('Page Ready')
  },
  onShow: function () {
    var _this = this
    console.log('Page Show')
    _this.initUser()
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
    _this.initUser()
    wx.stopPullDownRefresh()
  },
  onReachBottom: function () {
    var _this = this
    console.log('Page ReachBottom')
  },
  initUser: function () {
    var _this = this
    getApp().getUserId(function (id) {
      if (id) {
        _this.setData({ 'user.openid': id })
        getApp().getUserInfo(function (info) {
          if (info) {
            _this.setData({
              'user.enabled': true,
              'user.avatar': info.avatarUrl,
              'user.name': info.nickName
            })
            _this.search()
          } else {
            wx.showModal({
              title: '提示',
              content: '您尚未授权应用获取您的信息',
              showCancel: false
            })
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '您尚未授权应用获取您的信息',
          showCancel: false
        })
      }
    })
  },
  search: function () {
    var _this = this
    wx.request({
      method: 'POST',
      url: getApp().data.serverUrl + 'bxwxsvr/BX_UNI_SERVICE.json',
      data: {
        operflag: 'querylist',
        publisherid: _this.data.user.openid,
        pagesize: 99999,
        pageno: 1
      },
      success: function (res) {
        if (res.data && res.data.forumList && res.data.forumList.length) {
          var src = res.data.forumList
          var dest = []
          for (var i = 0; i < src.length; i++) {
            dest.push({
              code: src[i].id || '',
              icon: src[i].iconurl || '',
              name: src[i].forumname || '无名称',
              person: src[i].publisher || '',
              date: src[i].publishdate || '',
              category1: (src[i].cityname || '') + (src[i].cityname && src[i].classname ? ' · ' : '') + (src[i].classname || ''),
              category2: (src[i].searchlabelname || '').replace(/,/g, '  '),
              qrcode: src[i].publisherqrcode || '../../images/icon-qrcode-dark.png',
              caption: src[i].biz || ''
            })
          }
          _this.setData({
            'list.items': dest,
            'list.hasnone': false,
          })
        } else {
          _this.setData({
            'list.items': [],
            'list.hasnone': true,
          })
        }
      }
    })
  },
  gotoForm: function (event) {
    var _this = this
    if (_this.data.user.enabled) {
      wx.navigateTo({ url: '../group-form/group-form' })
    } else {
      wx.showModal({
        title: '提示',
        content: '您尚未授权应用获取您的信息，无法发布',
        showCancel: false
      })
    }
  },
  gotoDetail: function (event) {
    var _this = this
    wx.navigateTo({
      url: '../index-detail/index-detail?id=' + event.currentTarget.dataset.code
    })
  },
  showPrompt: function (event) {
    var _this = this
    return
    var image = event.currentTarget.dataset.image
    var caption = event.currentTarget.dataset.caption
    if (image) {
      _this.setData({
        'prompt.enabled': true,
        'prompt.image': image,
        'prompt.caption': '扫描二维码添加好友' + (caption ? '\n备注请说明 “' + caption + '”' : '')
      })
    } else {
      _this.setData({
        'prompt.enabled': true,
        'prompt.image': '../../images/icon-qrcode-none.png',
        'prompt.caption': '来晚了~ 二维码已经失效...'
      })
    }
  },
  hidePrompt: function (event) {
    var _this = this
    _this.setData({
      'prompt.enabled': false,
      'prompt.image': '',
      'prompt.caption': ''
    })
  }
})