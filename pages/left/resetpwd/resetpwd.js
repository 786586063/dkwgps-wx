var api = require('../../../config/api.js');
var app = getApp();
Page({
  data: {
    username: '',
    oldpwd: '',
    code: '',
    password: '',
    confirmPassword: ''
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    // 页面渲染完成

  },
  onReady: function () {

  },
  onShow: function () {
    // 页面显示

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  startReset: function () {
    var that = this;
    try {
      var res = wx.getStorageInfoSync('userInfo')
      console.log(res.keys)
      console.log(res.currentSize)
      console.log(res.limitSize)
    } catch (e) {
      // Do something when catch error
    }

    if (this.data.password.length < 3) {
      wx.showModal({
        title: '错误信息',
        content: '密码不得少于3位',
        showCancel: false
      });
      return false;
    }

    if (this.data.password != this.data.confirmPassword) {
      wx.showModal({
        title: '错误信息',
        content: '确认密码不一致',
        showCancel: false
      });
      return false;
    }
    var jm = util.getSHA1(that.data.mobile + app.globalData.key_words);
    wx.request({
      url: api.AuthReset,
      data: {
        username: wx.getStorageSync('userInfo'),
        jm: that.data.code,
        password: that.data.password
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.errno == 0) {
          wx.navigateBack();
        }
        else {
          wx.showModal({
            title: '密码重置失败',
            content: res.data.errmsg,
            showCancel: false
          });
        }
      }
    });
  },
  back: function () {
    wx.navigateBack({
      delta:1
    })
  },
  bindPasswordInput: function (e) {

    this.setData({
      password: e.detail.value
    });
  },
  bindConfirmPasswordInput: function (e) {

    this.setData({
      confirmPassword: e.detail.value
    });
  },
  bindoldPwdInput: function (e) {

    this.setData({
      oldpwd: e.detail.value
    });
  },
  bindCodeInput: function (e) {

    this.setData({
      code: e.detail.value
    });
  },
  clearInput: function (e) {
    switch (e.currentTarget.id) {
      case 'clear-password':
        this.setData({
          password: ''
        });
        break;
      case 'clear-confirm-password':
        this.setData({
          confirmPassword: ''
        });
        break;
      case 'clear-mobile':
        this.setData({
          mobile: ''
        });
        break;
      case 'clear-code':
        this.setData({
          code: ''
        });
        break;
    }
  }
})