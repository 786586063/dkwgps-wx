var api = require('../../../config/api.js');
var md5 = require('../../../utils/md5.js');
var sha1 = require('../../../utils/sha1.js');
var app = getApp();
Page({
  data: {
    username: '',
    oldpwd: '',
    code: '',
    oldpassword: '',
    password: '',
    confirmPassword: ''
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    // 页面渲染完成
    var that=this;
    var username = wx.getStorageSync("username");
    var oldpwd = wx.getStorageSync("password");
    console.log(username)
      that.setData({
        username: username,
        oldpwd: oldpwd
      })
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
    if (this.data.oldpwd != this.data.oldpassword) {
      wx.showModal({
        title: '错误信息',
        content: '旧密码不正确',
        showCancel: false
      });
      return false;
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

    var shajm = sha1.getSHA1(that.data.username + app.globalData.key_words).toUpperCase();
    console.log(shajm)
    console.log(that.data.username)
    wx.request({
      url: 'https://apiwx.dkwgps.com/userapi/Login/resetPwd',
      dataType:JSON,
      data: {
        username: that.data.username,
        jm: shajm,
        password: md5.getMD5(that.data.password).toUpperCase()
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var json = JSON.parse(res.data)
        console.log(json)
        if (json.result =='1') {
          wx.showModal({
            title: '密码修改成功',
            content: '密码修改成功',
            showCancel: false,
            success:function(res){
                 if(res.confirm){
                   wx.navigateBack();
                 }
            }
          });
        }
        else if (json.result == '2'){
          wx.showModal({
            title: '密码重置失败',
            content: '加密不匹配',
            showCancel: false
          });
        }else{
          wx.showModal({
            title: '密码重置失败',
            content: '服务器错误',
            showCancel: false
          });
        }
      }
    });
  },
  back: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  bindoldPasswordInput: function (e) {

    this.setData({
      oldpassword: e.detail.value
    });
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