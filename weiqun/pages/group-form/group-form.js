Page({
  data: {
    user: { enabled: false, openid: '', avatar: '../../images/icon-search-1.jpg', name: '' },
    form: {
      name: '',
      agree: true,
      desc: '',
      desccount: 0,
      remark: '',
      province: '',
      provinceid: '',
      city: '',
      cityid: '',
      class1: '',
      class1id: '',
      class2: '',
      class2id: '',
      qrcode: '',
      peopleqrcode: ''
    },
    provinces: [],
    cities: [],
    class1s: [],
    class2s: [],
    publiclabels: [],
    privatelabels: [],
    editlabel: { enabled: false, focused: false, value: '' },
    prompt: { enabled: false, image: '', caption: '' },
    dissubmit: false
  },
  onLoad: function (options) {
    var _this = this
    console.log('Page Load')
    _this.initUser()
    _this.initProvinces()
    _this.initClass1s()
    _this.initPublicLabels()
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
  },
  onReachBottom: function () {
    var _this = this
    console.log('Page ReachBottom')
  },
  setFormName: function (event) {
    var _this = this
    _this.setData({
      'form.name': event.detail.value || ''
    })
    console.log(_this.data.form)
  },
  setFormAgree: function (event) {
    var _this = this
    _this.setData({
      'form.agree': !!event.detail.value[0] || false
    })
    console.log(_this.data.form)
  },
  setFormDesc: function (event) {
    var _this = this
    _this.setData({
      'form.desc': event.detail.value || '',
      'form.desccount': event.detail.value.length || 0
    })
    console.log(_this.data.form)
  },
  setFormRemark: function (event) {
    var _this = this
    _this.setData({
      'form.remark': event.detail.value || ''
    })
    console.log(_this.data.form)
  },
  setFormProvince: function (event) {
    var _this = this
    var item = _this.data.provinces[event.detail.value] || {}
    _this.setData({
      'form.province': item.name || '',
      'form.provinceid': item.id || '',
      'form.city': '',
      'form.cityid': ''
    })
    _this.initCities()
    console.log(_this.data.form)
  },
  setFormCity: function (event) {
    var _this = this
    var item = _this.data.cities[event.detail.value] || {}
    _this.setData({
      'form.city': item.name || '',
      'form.cityid': item.id || ''
    })
    console.log(_this.data.form)
  },
  setFormClass1: function (event) {
    var _this = this
    var item = _this.data.class1s[event.detail.value] || {}
    _this.setData({
      'form.class1': item.name || '',
      'form.class1id': item.id || '',
      'form.class2': '',
      'form.class2id': ''
    })
    _this.initClass2s()
    console.log(_this.data.form)
  },
  setFormClass2: function (event) {
    var _this = this
    var item = _this.data.class2s[event.detail.value] || {}
    _this.setData({
      'form.class2': item.name || '',
      'form.class2id': item.id || ''
    })
    console.log(_this.data.form)
  },
  initProvinces: function () {
    var _this = this
    wx.request({
      method: 'POST',
      url: getApp().data.serverUrl + 'bxwxsvr/BX_UNI_SERVICE.json',
      data: {
        operflag: 'queryprovince'
      },
      success: function (res) {
        if (res.data && res.data.provinceList && res.data.provinceList.length) {
          var src = res.data.provinceList
          var dest = []
          for (var i = 0; i < src.length; i++) {
            dest.push({
              id: src[i].cityid || '',
              name: src[i].cityname || ''
            })
          }
          _this.setData({
            'provinces': dest
          })
        } else {
          _this.setData({
            'provinces': []
          })
        }
      },
      fail: function (err) {
        _this.setData({
          'provinces': []
        })
      }
    })
  },
  initCities: function () {
    var _this = this
    wx.request({
      method: 'POST',
      url: getApp().data.serverUrl + 'bxwxsvr/BX_UNI_SERVICE.json',
      data: {
        operflag: 'querycity',
        provinceid: _this.data.form.provinceid
      },
      success: function (res) {
        if (res.data && res.data.cityList && res.data.cityList.length) {
          var src = res.data.cityList
          var dest = []
          for (var i = 0; i < src.length; i++) {
            dest.push({
              id: src[i].cityid || '',
              name: src[i].cityname || ''
            })
          }
          _this.setData({
            'cities': dest
          })
        } else {
          _this.setData({
            'cities': []
          })
        }
      },
      fail: function (err) {
        _this.setData({
          'cities': []
        })
      }
    })
  },
  initClass1s: function () {
    var _this = this
    wx.request({
      method: 'POST',
      url: getApp().data.serverUrl + 'bxwxsvr/BX_UNI_SERVICE.json',
      data: {
        operflag: 'queryclasslist'
      },
      success: function (res) {
        if (res.data && res.data.classList && res.data.classList.length) {
          var src = res.data.classList
          var dest = []
          for (var i = 0; i < src.length; i++) {
            dest.push({
              id: src[i].classid || '',
              name: src[i].classname || ''
            })
          }
          _this.setData({
            'class1s': dest
          })
        } else {
          _this.setData({
            'class1s': []
          })
        }
      },
      fail: function (err) {
        _this.setData({
          'class1s': []
        })
      }
    })
  },
  initClass2s: function () {
    var _this = this
    wx.request({
      method: 'POST',
      url: getApp().data.serverUrl + 'bxwxsvr/BX_UNI_SERVICE.json',
      data: {
        operflag: 'querysmallclasslist',
        classid: _this.data.form.class1id
      },
      success: function (res) {
        if (res.data && res.data.smallClassList && res.data.smallClassList.length) {
          var src = res.data.smallClassList
          var dest = []
          for (var i = 0; i < src.length; i++) {
            dest.push({
              id: src[i].classid || '',
              name: src[i].classname || ''
            })
          }
          _this.setData({
            'class2s': dest
          })
        } else {
          _this.setData({
            'class2s': []
          })
        }
      },
      fail: function (err) {
        _this.setData({
          'class2s': []
        })
      }
    })
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
  uploadPeopleQrcode: function (event) {
    var _this = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        wx.uploadFile({
          url: getApp().data.serverUrl + 'bxwxsvr/servlet/FileUpload',
          filePath: res.tempFilePaths[0],
          name: 'file',
          success: function (res) {
            if (res.data) {
              _this.setData({
                'form.peopleqrcode': getApp().data.serverUrl + 'bxwxsvr/fileupload/' + res.data
              })
              wx.showToast({ title: '上传成功' })
            } else {
              wx.showToast({ title: '上传失败', duration: 4000 })
            }
          },
          fail: function (error) {
            wx.showToast({ title: '上传失败', duration: 4000 })
          }
        })
      }
    })
  },
  uploadQrcode: function (event) {
    var _this = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        wx.uploadFile({
          url: getApp().data.serverUrl + 'bxwxsvr/servlet/FileUpload',
          filePath: res.tempFilePaths[0],
          name: 'file',
          success: function (res) {
            if (res.data) {
              _this.setData({
                'form.qrcode': getApp().data.serverUrl + 'bxwxsvr/fileupload/' + res.data
              })
              wx.showToast({ title: '上传成功' })
            } else {
              wx.showToast({ title: '上传失败', duration: 4000 })
            }
          },
          fail: function (error) {
            wx.showToast({ title: '上传失败', duration: 4000 })
          }
        })
      }
    })
  },
  initPublicLabels: function () {
    var _this = this
    wx.request({
      method: 'POST',
      url: getApp().data.serverUrl + 'bxwxsvr/BX_UNI_SERVICE.json',
      data: {
        operflag: 'querypublabel'
      },
      success: function (res) {
        if (res.data && res.data.labelList && res.data.labelList.length) {
          var src = res.data.labelList
          var dest = []
          for (var i = 0; i < src.length; i++) {
            dest.push({
              name: src[i].labelname || '',
              checked: false
            })
          }
          _this.setData({
            'publiclabels': dest
          })
        } else {
          _this.setData({
            'publiclabels': []
          })
        }
      },
      fail: function (err) {
        _this.setData({
          'publiclabels': []
        })
      }
    })
  },
  checkLabel: function (event) {
    var _this = this
    var name = event.currentTarget.dataset.name
    for (var i = 0; i < _this.data.publiclabels.length; i++) {
      if (_this.data.publiclabels[i].name == name) {
        var target = 'publiclabels[' + i + '].checked'
        var params = {}
        if (_this.countCheckedLabel() >= 3 && !_this.data.publiclabels[i].checked) return
        params[target] = !_this.data.publiclabels[i].checked
        _this.setData(params)
      }
    }
    for (var j = 0; j < _this.data.privatelabels.length; j++) {
      if (_this.data.privatelabels[j].name == name) {
        var target = 'privatelabels[' + j + '].checked'
        var params = {}
        if (_this.countCheckedLabel() >= 3 && !_this.data.privatelabels[j].checked) return
        params[target] = !_this.data.privatelabels[j].checked
        _this.setData(params)
      }
    }
  },
  countCheckedLabel: function () {
    var _this = this
    var count = 0;
    for (var i = 0; i < _this.data.publiclabels.length; i++) {
      if (_this.data.publiclabels[i].checked === true) {
        count++
      }
    }
    for (var j = 0; j < _this.data.privatelabels.length; j++) {
      if (_this.data.privatelabels[j].checked === true) {
        count++
      }
    }
    return count
  },
  isInLabels: function (name) {
    var _this = this
    if (!name) return false
    var flag = false
    for (var i = 0; i < _this.data.publiclabels.length; i++) {
      if (_this.data.publiclabels[i].name == name) {
        flag = true
      }
    }
    for (var j = 0; j < _this.data.privatelabels.length; j++) {
      if (_this.data.privatelabels[j].name == name) {
        flag = true
      }
    }
    return flag
  },
  enableEditLabel: function (event) {
    var _this = this
    _this.setData({
      'editlabel.enabled': true,
      'editlabel.focused': true,
      'editlabel.value': ''
    })
  },
  disableEditLabel: function (event) {
    var _this = this
    var value = event.detail.value
    if (value) return
    _this.setData({
      'editlabel.enabled': false,
      'editlabel.focused': false,
      'editlabel.value': ''
    })
  },
  addPrivateLabel: function (event) {
    var _this = this
    var value = event.detail.value
    if (_this.isInLabels(value)) {
      wx.showToast({ title: '标签已存在', duration: 3000 })
      return
    }
    if (value) {
      var list = _this.data.privatelabels
      list.push({
        name: value,
        checked: false
      })
      _this.setData({
        'privatelabels': list
      })
    }
    _this.setData({
      'editlabel.enabled': false,
      'editlabel.focused': false,
      'editlabel.value': ''
    })
  },
  gotoGroup: function (event) {
    var _this = this
    if (_this.data.dissubmit) return
    _this.setData({
      'dissubmit': true
    })
    if (!_this.data.user.enabled) {
      wx.showModal({
        title: '提示',
        content: '您尚未授权应用获取您的信息，无法发布',
        showCancel: false
      })
      return
    }
    if (!_this.data.form.agree) {
      wx.showModal({
        title: '提示',
        content: '您必须先点选同意微群搜索运营规范',
        showCancel: false
      })
      return
    }
    var labels = []
    for (var i = 0; i < _this.data.publiclabels.length; i++) {
      if (_this.data.publiclabels[i].checked === true) {
        labels.push(_this.data.publiclabels[i].name)
      }
    }
    for (var j = 0; j < _this.data.privatelabels.length; j++) {
      if (_this.data.privatelabels[j].checked === true) {
        labels.push(_this.data.privatelabels[j].name)
      }
    }
    var data = { operflag: 'addone' }
    data.searchlebelname = labels.toString()
    data.forumdesc = _this.data.form.desc
    data.iconurl = _this.data.user.avatar
    data.biz = _this.data.form.remark
    data.cityid = _this.data.form.cityid
    data.cityname = _this.data.form.city
    data.classid = _this.data.form.class1id
    data.classname = _this.data.form.class1
    data.smallclassid = _this.data.form.class2id
    data.smallclassname = _this.data.form.class2
    data.publisherid = _this.data.user.openid
    data.publisher = _this.data.user.name
    data.publisherpicurl = _this.data.user.avatar
    data.publisherqrcode = _this.data.form.peopleqrcode
    data.provinceid = _this.data.form.provinceid
    data.provincename = _this.data.form.province
    data.forumname = _this.data.form.name
    data.forumqrcode = _this.data.form.qrcode
    data.ishot = 'N'
    data.uniuuid = require('../../public/public').uuid().replace(/-/g, '')
    if (!data.forumname) {
      wx.showModal({
        title: '提示',
        content: '群名称不能为空',
        showCancel: false
      })
      return
    }
    if (!data.provinceid) {
      wx.showModal({
        title: '提示',
        content: '请选择省份',
        showCancel: false
      })
      return
    }
    if (!data.cityid) {
      wx.showModal({
        title: '提示',
        content: '请选择城市',
        showCancel: false
      })
      return
    }
    if (!data.classid) {
      wx.showModal({
        title: '提示',
        content: '请选择分类',
        showCancel: false
      })
      return
    }
    if (!data.smallclassid) {
      wx.showModal({
        title: '提示',
        content: '请选择二级分类',
        showCancel: false
      })
      return
    }
    if (!data.forumdesc) {
      wx.showModal({
        title: '提示',
        content: '请填写群描述',
        showCancel: false
      })
      return
    }
    if (!data.searchlebelname) {
      wx.showModal({
        title: '提示',
        content: '请选择群标签',
        showCancel: false
      })
      return
    }
    if (!data.publisherqrcode) {
      wx.showModal({
        title: '提示',
        content: '请上传群主二维码',
        showCancel: false
      })
      return
    }
    if (!data.biz) {
      data.biz = '加群'
    }
    if (!data.publisherid || !data.publisher) {
      wx.showModal({
        title: '提示',
        content: '未能获取您的信息，无法发布',
        showCancel: false
      })
      return
    }
    wx.request({
      method: 'POST',
      url: getApp().data.serverUrl + 'bxwxsvr/BX_UNI_SERVICE.json',
      data: data,
      success: function (res) {
        if (res.data && res.data.success) {
          wx.showModal({
            title: '提示',
            content: '发布成功',
            showCancel: false,
            complete: function () {
              wx.switchTab({ url: '../group/group' })
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '发布失败',
            showCancel: false
          })
        }
      },
      fail: function () {
        wx.showModal({
          title: '提示',
          content: '发布失败',
          showCancel: false
        })
      }
    })
  },
  showPrompt: function (event) {
    var _this = this
    var image = event.currentTarget.dataset.image
    if (image) {
      _this.setData({
        'prompt.enabled': true,
        'prompt.image': image,
        'prompt.caption': ''
      })
    } else {
      _this.setData({
        'prompt.enabled': true,
        'prompt.image': '../../images/icon-qrcode-none.png',
        'prompt.caption': '请上传二维码'
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
    _this.setData({
      'prompt.enabled': false,
      'prompt.image': '',
      'prompt.caption': ''
    })
  }
})