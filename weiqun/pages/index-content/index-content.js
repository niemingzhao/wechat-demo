Page({
  data: {
    select: { parent: '', value: '', items: [] },
    search: { enabled: false, focused: false, value: '', placeholder: '搜索关键词、群ID、标签' },
    list: { count: 0, limit: 10, items: [], loading: false, hasmore: true, hasnone: false },
    prompt: { enabled: false, image: '', caption: '' }
  },
  onLoad: function (options) {
    var _this = this
    console.log('Page Load')
    _this.setData({ 'select.parent': options.id || '' })
    if (options.name) wx.setNavigationBarTitle({ title: options.name })
    _this.initSelect()
    _this.initList()
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
    _this.initList()
    _this.disableSearch()
    wx.stopPullDownRefresh()
  },
  onReachBottom: function () {
    var _this = this
    console.log('Page ReachBottom')
    if (_this.data.list.loading) return
    if (!_this.data.list.hasmore) return
    if (_this.data.list.hasnone) return
    _this.setData({
      'list.loading': true,
    })
    wx.request({
      method: 'POST',
      url: getApp().data.serverUrl + 'bxwxsvr/BX_UNI_SERVICE.json',
      data: {
        operflag: 'querylist',
        keywords: +_this.data.search.value ? +_this.data.search.value : _this.data.search.value,
        classid: _this.data.select.parent,
        smallclassid: _this.data.select.value,
        // provinceid: getApp().data.geoLocation ? getApp().data.geoLocation.provinceid : '',
        cityid: getApp().data.geoLocation ? getApp().data.geoLocation.cityid + '00' : '',
        pagesize: _this.data.list.limit,
        pageno: parseInt(_this.data.list.count / _this.data.list.limit) + 1
      },
      success: function (res) {
        if (res.data && res.data.forumList && res.data.forumList.length) {
          var src = res.data.forumList
          var dest = _this.data.list.items
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
            'list.count': _this.data.list.count + src.length,
            'list.items': dest,
            'list.loading': false,
            'list.hasmore': true,
            'list.hasnone': false,
          })
          if (_this.data.list.count >= parseInt(res.data.total)) {
            _this.setData({
              'list.hasmore': false
            })
          }
        } else {
          _this.setData({
            'list.loading': false,
            'list.hasmore': false,
            'list.hasnone': false,
          })
        }
      },
      fail: function () {
        _this.setData({
          'list.loading': false
        })
      }
    })
  },
  enableSearch: function (event) {
    var _this = this
    _this.setData({
      'search.enabled': true,
      'search.focused': true,
      'search.value': ''
    })
  },
  disableSearch: function (event) {
    var _this = this
    _this.setData({
      'search.enabled': false,
      'search.focused': false,
      'search.value': ''
    })
    _this.search()
  },
  focusSearch: function (event) {
    var _this = this
    _this.setData({
      'search.focused': true
    })
  },
  cancelSearch: function (event) {
    var _this = this
    _this.setData({
      'search.focused': false,
      'search.value': ''
    })
  },
  search: function (event) {
    var _this = this
    _this.initList()
    if (!event || !event.detail.value) {
      _this.setData({
        'search.value': ''
      })
    } else {
      _this.setData({
        'search.value': event.detail.value
      })
    }
    _this.setData({
      'list.loading': true,
    })
    wx.request({
      method: 'POST',
      url: getApp().data.serverUrl + 'bxwxsvr/BX_UNI_SERVICE.json',
      data: {
        operflag: 'querylist',
        keywords: +_this.data.search.value ? +_this.data.search.value : _this.data.search.value,
        classid: _this.data.select.parent,
        smallclassid: _this.data.select.value,
        // provinceid: getApp().data.geoLocation ? getApp().data.geoLocation.provinceid : '',
        cityid: getApp().data.geoLocation ? getApp().data.geoLocation.cityid + '00' : '',
        pagesize: _this.data.list.limit,
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
            'list.count': _this.data.list.count + src.length,
            'list.items': dest,
            'list.loading': false,
            'list.hasmore': true,
            'list.hasnone': false,
          })
          if (_this.data.list.count >= parseInt(res.data.total)) {
            _this.setData({
              'list.hasmore': false
            })
          }
        } else {
          _this.setData({
            'list.count': 0,
            'list.items': [],
            'list.loading': false,
            'list.hasmore': true,
            'list.hasnone': true,
          })
        }
      },
      fail: function () {
        _this.setData({
          'list.loading': false
        })
      }
    })
  },
  select: function (event) {
    var _this = this
    if (!_this.data.select.items.length) return
    var current = event ? event.currentTarget.dataset.code : ''
    var items = _this.data.select.items
    if (!current) current = items[0].code
    for (var i = 0; i < items.length; i++) {
      var key = 'select.items[' + i + '].active'
      var param = {}
      if (items[i].code == current) {
        param[key] = true
        param['select.value'] = current
      } else {
        param[key] = false
      }
      _this.setData(param)
    }
    _this.search()
  },
  initSelect: function () {
    var _this = this
    wx.request({
      method: 'POST',
      url: getApp().data.serverUrl + 'bxwxsvr/BX_UNI_SERVICE.json',
      data: {
        operflag: 'querysmallclasslist',
        classid: _this.data.select.parent
      },
      success: function (res) {
        if (res.data && res.data.smallClassList && res.data.smallClassList.length) {
          var src = res.data.smallClassList
          var dest = []
          for (var i = 0; i < src.length; i++) {
            dest.push({
              code: src[i].classid || '',
              name: src[i].classname || '',
              active: false
            })
          }
          _this.setData({ 'select.items': dest })
        } else {
          _this.setData({
            'select.items': []
          })
        }
        _this.select()
      }
    })
  },
  initList: function () {
    var _this = this
    _this.setData({
      'list.count': 0,
      'list.items': [],
      'list.loading': false,
      'list.hasmore': true,
      'list.hasnone': false,
    })
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