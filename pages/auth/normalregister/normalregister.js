// pages/auth/normalregister/normalregister.js
var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
var user = require('../../../services/user.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    pwd: '',
    confirmpwd: '',
    mobile: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  register:function(){
    var that = this;

    if (this.data.pwd.length < 3 || this.data.username.length < 3) {
      wx.showModal({
        title: '错误信息',
        content: '用户名和密码不得少于3位',
        showCancel: false
      });
      return false;
    }

    if (this.data.pwd != this.data.confirmpwd) {
      wx.showModal({
        title: '错误信息',
        content: '确认密码不一致',
        showCancel: false
      });
      return false;
    }

    if (this.data.mobile.length == 0) {
      wx.showModal({
        title: '错误信息',
        content: '手机号和验证码不能为空',
        showCancel: false
      });
      return false;
    }
    var pwd = util.getMd5(that.data.pwd);
    var username = that.data.username;
    var jm = util.getSHA1(username + app.globalData.key_words);
    wx.request({
      url: api.AuthNormalRegister,
      data: {
        username: username,
        password: pwd,
        tel: that.data.mobile,
        email: '',
        domain: 'www.bcxgps.com',
        ip: 'WX',
        jm: jm.toUpperCase()
      },
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        /**
         * 1注册成功，0注册失败，2验证码超10分钟失效， 3 手机号已注册，4验证码无效
         */
        if (res.data.result == 1) {
          app.globalData.hasLogin = true;
          // console.log(JSON.stringify(res))
          wx.setStorageSync('userInfo', res.data.datas);
          util.showToast('注册成功，稍后为您跳转至首页！')
          setTimeout(function () {
            wx.navigateTo({
              url: '../../index/index',
            })
          }, 2000)

        } else if (res.data.result == 3) {
          util.showToast('账户以存在！')
        } 
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  bindUsernameInput: function (e) {

    this.setData({
      username: e.detail.value
    });
  
  },
  bindPwdInput: function (e) {

    this.setData({
      pwd: e.detail.value
    });
 
  },
  bindConfirmPwdInput: function (e) {

    this.setData({
      confirmpwd: e.detail.value
    });
    
  },
  bindMobileInput: function (e) {

    this.setData({
      mobile: e.detail.value
    });
   
  },
    




})