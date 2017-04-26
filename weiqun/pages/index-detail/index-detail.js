Page({
  data: {
    code: '',
    detail: {},
    prompt: { enabled: false, image: '', caption: '' },
    lock: { touchstart: 0, touchend: 0 }
  },
  onLoad: function (options) {
    var _this = this
    console.log('Page Load')
    _this.setData({ 'code': options.id || '' })
    _this.initDetail()
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
    _this.initDetail()
    wx.stopPullDownRefresh()
  },
  onReachBottom: function () {
    var _this = this
    console.log('Page ReachBottom')
  },
  initDetail: function () {
    var _this = this
    wx.request({
      method: 'POST',
      url: getApp().data.serverUrl + 'bxwxsvr/BX_UNI_SERVICE.json',
      data: {
        operflag: 'querylist',
        id: _this.data.code,
        pagesize: 1,
        pageno: 1
      },
      success: function (res) {
        if (res.data && res.data.forumList && res.data.forumList.length) {
          var src = res.data.forumList
          var dest = {
            image: src[0].iconurl || '',
            person: src[0].publisher || '',
            category1: (src[0].cityname || '') + (src[0].cityname && src[0].classname ? ' · ' : '') + (src[0].classname || ''),
            category2: (src[0].searchlabelname || '').replace(/,/g, '  '),
            name: src[0].forumname || '无名称',
            id: src[0].id || '',
            description: (src[0].publishdate ? '创建时间：' + src[0].publishdate + '\n' : '') + (src[0].forumdesc || '群简介为空。'),
            qrcode: src[0].publisherqrcode || '../../images/icon-qrcode-dark.png',
            caption: src[0].biz || '',
            mainqrcode: src[0].forumqrcode || '../../images/icon-qrcode-none.png',
            maincaption: src[0].forumqrcode ? '扫描群二维码 加入群' : '来晚了~ 群二维码已经失效...'
          }
          _this.setData({ 'detail': dest })
        }
      }
    })
  },
  showPrompt: function (event) {
    var _this = this
    var image = event.currentTarget.dataset.image
    var caption = event.currentTarget.dataset.caption
    if (image) {
      _this.setData({
        'prompt.enabled': true,
        'prompt.image': image,
        'prompt.caption': '长按保存二维码，打开微信扫一扫添加好友邀请进群' + (caption ? '\n备注请说明 “' + caption + '”' : '')
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
  },
  downloadPic: function (event) {
    var _this = this
    var url = event.currentTarget.dataset.url
    if (url && url !== '../../images/icon-qrcode-none.png') {
      wx.showModal({
        title: '提示',
        content: '保存二维码，打开微信扫一扫',
        confirmText: '保存',
        success: function (res) {
          if (res.confirm) {
            wx.downloadFile({
              url: url,
              success: function (res) {
                var path = res.tempFilePath || ''
                wx.saveImageToPhotosAlbum({
                  filePath: path,
                  success: function (res) {
                  },
                  fail: function (err) {
                    wx.showToast({ title: '保存二维码失败', duration: 4000 })
                  }
                })
              },
              fail: function (err) {
                wx.showToast({ title: '保存二维码失败', duration: 4000 })
              }
            })
          }
        }
      })
    }
  },
  previewPic: function (event) {
    var _this = this
    var touchTime = _this.data.lock.touchend - _this.data.lock.touchstart
    var url = event.currentTarget.dataset.url
    if (url && url !== '../../images/icon-qrcode-none.png') {
      if (touchTime < 350) {
        wx.previewImage({
          urls: [url]
        })
      }
    }
  },
  touchstartPic: function (event) {
    var _this = this
    _this.setData({ 'lock.touchstart': event.timeStamp })
  },
  touchendPic: function (event) {
    var _this = this
    _this.setData({ 'lock.touchend': event.timeStamp })
  },
  errorPic: function (event) {
    var _this = this
    var target = event.currentTarget.dataset.errorTarget
    if (target === 'detail.mainqrcode') {
      _this.setData({
        'detail.mainqrcode': '',
        'detail.maincaption': '二维码读取错误...',
      })
    } else if (target === 'prompt.image') {
      _this.setData({
        'prompt.image': '',
        'prompt.caption': '二维码读取错误...',
      })
    }
  }
})