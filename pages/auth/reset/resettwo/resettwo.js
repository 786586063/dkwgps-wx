var api = require('../../../../config/api.js');
var util = require('../../../../utils/util.js');
var user = require('../../../../services/user.js');
var interval = null //倒计时函数
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:'',
    mobile: '',
    code: '',
    daojishi: '获取验证码',
    sendstatus: false,
    time: '获取验证码', //倒计时 
    currentTime: 61,
    disabled: false,
    openid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(options.username)
    this.setData({
      username: options.username
    });

  },
  bindMobileInput: function (e) {

    this.setData({
      mobile: e.detail.value
    });
  },
  bindCodeInput: function (e) {

    this.setData({
      code: e.detail.value
    });
  },
  sendCode: function () {
    var that = this;
    if (that.data.mobile.length < 1) {
      wx.showModal({
        title: '注意',
        content: '手机号码不能为空！',
        showCancel: false
      });
    } else {
      //先去验证用户名和手机号是否正确
      var sha1 = util.getSHA1(that.data.mobile + app.globalData.key_words);
      wx.request({
        url: api.ResetPwdUserCheck,
        data: {
          tel: that.data.mobile,
          username: that.data.username,
          jm: sha1.toUpperCase()
        },
        method: 'GET',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(JSON.stringify(res));
          if (res.data.result == 1) {//验证通过
            util.showToast('验证成功！')
            that.reallySendCode(res.data.datas.tel, res.data.datas.loginname)

          } else if (res.data.result == 0) {//验证不通过
            util.showToast('验证失败，用户名或手机号码错误！')
          } else  {
            util.showToast('验证失败')
          }
        }
      });
    
    }
  

  },
  reallySendCode(tel, username){
    var that = this;
    var sha1 = util.getSHA1(tel + app.globalData.key_words);
    wx.request({
      url: api.ResetPwdYZM,
      data: {
        tel: tel,
        username: username,
        jm: sha1.toUpperCase()
      },
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(JSON.stringify(res));
        if (res.data.result == 1) {//发送成功
          that.getCode();

        } else if (res.data.result == 0) {//验证码发送失败
          util.showToast('验证码发送失败')
        } else if (res.data.result == 3) {//半小时发送超过三次不太发送
          util.showToast('半小时发送超过三次不太发送')
        }
      }
    });
  },
  getCode: function (options) {
    var that = this;
    var currentTime = that.data.currentTime
    interval = setInterval(function () {
      currentTime--;
      that.setData({
        time: currentTime + '秒'
      })
      if (currentTime <= 0) {
        // clearInterval(interval)
        clearInterval(interval)
        that.setData({
          time: '重新发送',
          currentTime: 61,
          disabled: false
        })
      }
    }, 1000)
  },
  enterNext:function(){
    //验证验证码是否有效，有效则跳转至修改界面界面
    var that = this;
    var username = that.data.username;
    var tel = that.data.mobile;
    var code = that.data.code;
    console.log(username+" "+tel+" "+code);
    if (that.data.mobile.length < 1) {
      wx.showModal({
        title: '注意',
        content: '手机号码不能为空！',
        showCancel: false
      });
    }else if(code.length < 1){
      wx.showModal({
        title: '注意',
        content: '验证码为空！',
        showCancel: false
      });
    }else{
      var sha1 = util.getSHA1(tel + app.globalData.key_words);
      wx.request({
        url: api.ResetPwdYZMCheck,
        data: {
          tel: tel,
          username: username,
          yzm:code,
          jm: sha1.toUpperCase()
        },
        method: 'POST',
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          console.log(JSON.stringify(res));
          if (res.data.result == 1) {//发送成功
            wx.navigateTo({
              url: '../resetthree/resetthree?username='+username
              
            })
          } else if (res.data.result == 0) {
            util.showToast('验证失败！')
          } else if (res.data.result == 3) {
            util.showToast('验证码失效')
          }else{
            util.showToast('失败！')
          }
        }
      });
    }

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
  
  }
})