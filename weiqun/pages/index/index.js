Page({
  data: {
    search: { enabled: true, focused: false, value: '', placeholder: '搜索关键词、群ID、分类、标签' },
    list: { count: 0, limit: 10, items: [], loading: false, hasmore: true, hasnone: false },
    swiper: { indicator: true, autoplay: true, interval: 5000, duration: 1000, images: [] },
    menu: { items: [] },
    hots: { items: [], hasnone: false },
    prompt: { enabled: false, image: '', caption: '' }
  },
  onLoad: function (options) {
    var _this = this
    console.log('Page Load')
    getApp().getGeoLocation(function (data) {
      if (!data) {
        wx.showModal({
          title: '提示',
          content: '未能定位您的所在城市',
          showCancel: false
        })
      }
      _this.initSwiper()
      _this.initMenu()
      _this.initHots()
      _this.initList()
    })
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
    _this.initSwiper()
    _this.initMenu()
    _this.initHots()
    wx.stopPullDownRefresh()
  },
  onReachBottom: function () {
    var _this = this
    console.log('Page ReachBottom')
    if (!_this.data.search.value) return
    if (!_this.data.search.focused) return
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
    _this.initList()
  },
  disableSearch: function (event) {
    var _this = this
    _this.setData({
      'search.enabled': false,
      'search.focused': false,
      'search.value': ''
    })
    _this.initList()
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
    _this.initList()
  },
  search: function (event) {
    var _this = this
    _this.initList()
    if (!event.detail.value) {
      _this.setData({
        'search.value': ''
      })
    } else {
      _this.setData({
        'search.value': event.detail.value,
        'list.loading': true,
      })
      wx.request({
        method: 'POST',
        url: getApp().data.serverUrl + 'bxwxsvr/BX_UNI_SERVICE.json',
        data: {
          operflag: 'querylist',
          keywords: +event.detail.value ? +event.detail.value : event.detail.value,
          // provinceid: getApp().data.geoLocation ? getApp().data.geoLocation.provinceid : '',
          cityid: getApp().data.geoLocation ? getApp().data.geoLocation.cityid + "00" : '',
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
    }
  },
  initSwiper: function () {
    var _this = this
    wx.request({
      method: 'POST',
      url: getApp().data.serverUrl + 'bxwxsvr/BX_UNI_SERVICE.json',
      data: {
        operflag: 'queryrollpiclist',
      },
      success: function (res) {
        if (res.data && res.data.rollPicList && res.data.rollPicList.length) {
          var src = res.data.rollPicList
          var dest = []
          for (var i = 0; i < src.length; i++) dest.push({
            img: src[i].picurl ? (/http/.test(src[i].picurl) ? src[i].picurl : getApp().data.serverUrl + 'bxwxsvr/fileupload/' + src[i].picurl) : '',
            url: src[i].linkid ? '../index-detail/index-detail?id=' + src[i].linkid : '',
            able: src[i].state == 1 ? false : true
          })
          _this.setData({ 'swiper.images': dest })
        } else {
          _this.setData({
            'swiper.images': [
              { img: '../../images/image-carousel-1.png', url: '', able: false },
              { img: '../../images/image-carousel-2.png', url: '', able: false },
              { img: '../../images/image-carousel-3.png', url: '', able: false }
            ]
          })
        }
      }
    })
  },
  gotoImg: function (event) {
    var _this = this
    var able = event.currentTarget.dataset.able
    if (!able) return
    var url = event.currentTarget.dataset.url
    wx.navigateTo({
      url: url
    })
  },
  initMenu: function () {
    var _this = this
    wx.request({
      method: 'POST',
      url: getApp().data.serverUrl + 'bxwxsvr/BX_UNI_SERVICE.json',
      data: {
        operflag: 'queryclasslist',
      },
      success: function (res) {
        if (res.data && res.data.classList && res.data.classList.length) {
          var src = res.data.classList
          var dest = []
          for (var i = 0; i < src.length; i++) {
            if (i % 8 === 0) dest.push([])
            dest[dest.length - 1].push({
              icon: src[i].iconurl ? (/http/.test(src[i].iconurl) ? src[i].iconurl : getApp().data.serverUrl + 'bxwxsvr/fileupload/' + src[i].iconurl) : '',
              name: src[i].classname || '',
              code: src[i].classid || ''
            })
          }
          _this.setData({ 'menu.items': dest })
        } else {
          _this.setData({
            'menu.items': []
          })
        }
      }
    })
  },
  initHots: function () {
    var _this = this
    wx.request({
      method: 'POST',
      url: getApp().data.serverUrl + 'bxwxsvr/BX_UNI_SERVICE.json',
      data: {
        operflag: 'querylist',
        ishot: "Y",
        // provinceid: getApp().data.geoLocation ? getApp().data.geoLocation.provinceid : '',
        cityid: getApp().data.geoLocation ? getApp().data.geoLocation.cityid + '00' : '',
        pagesize: 99999,
        pageno: 1
      },
      success: function (res) {
        if (res.data && res.data.forumList && res.data.forumList.length) {
          var src = res.data.forumList
          var dest = []
          for (var i = 0; i < (src.length > 7 ? 7 : src.length); i++) {
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
            'hots.items': dest,
            'hots.hasnone': false,
          })
        } else {
          _this.setData({
            'hots.items': [],
            'hots.hasnone': true,
          })
        }
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
  gotoMenu: function (event) {
    var _this = this
    wx.navigateTo({
      url: '../index-content/index-content?id=' + event.currentTarget.dataset.code + '&name=' + event.currentTarget.dataset.name
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