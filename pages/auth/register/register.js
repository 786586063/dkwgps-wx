
var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
var user = require('../../../services/user.js');
var interval = null //倒计时函数
var app = getApp();
Page({
  data: {
    username: '',
    password: '123456',
    confirmPassword: '123456',
    mobile: '',
    code: '',
    daojishi:'获取验证码',
    sendstatus:false,
    time: '获取验证码', //倒计时 
    currentTime: 61,
    disabled:false,
    openid :''
  },
  onLoad: function (options) {
    var that = this
    // 页面初始化 options为页面跳转所带来的参数
    var openid = options.openid;
    // var openid = wx.getStorageInfoSync('openid')
    console.log("openid:  "+ openid)
    if(openid !=null){ //从微信直接登录跳转过来
      this.data.openid = openid;
    }
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
  sendCode: function () {
    var that = this;
    if(that.data.mobile.length <1){
      wx.showModal({
        title: '注意',
        content: '手机号码不能为空！',
        showCancel: false
      });
    }else{
      var sha1 = util.getSHA1(that.data.mobile + app.globalData.key_words);
      
      wx.request({
        url: api.UserRegisterFastYZM,
        data: {
          tel: that.data.mobile,
          jm: sha1.toUpperCase()
        },
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
         console.log(JSON.stringify(res));
         if(res.data.result ==1){//发送成功
           that.getCode();
         
         }else if(res.data.result ==0){//验证码无效

         }else if(res.data.result == 3){//验证码超过10分钟无效

         }
        }
      });
    }
    // if (that.data.sendstatus){
    //   var i = 60;
    //   setTimeout(function () {
    //     if (i > 0) {
    //       console.log(i);
    //       that.setData({
    //         daoshiji: '重新获取' + i
    //       });
    //       i--;
    //     }


    //   }, 1000)
    // }
   
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
  enterNext: function () {
    var that = this;

    // if (this.data.password.length < 3 || this.data.username.length < 3) {
    //   wx.showModal({
    //     title: '错误信息',
    //     content: '用户名和密码不得少于3位',
    //     showCancel: false
    //   });
    //   return false;
    // }

    if (this.data.password != this.data.confirmPassword) {
      wx.showModal({
        title: '错误信息',
        content: '确认密码不一致',
        showCancel: false
      });
      return false;
    }

    if (this.data.mobile.length == 0 || this.data.code.length == 0) {
      wx.showModal({
        title: '错误信息',
        content: '手机号和验证码不能为空',
        showCancel: false
      });
      return false;
    }
    var pwd = util.getMd5(that.data.password);
    var jm = util.getSHA1(that.data.mobile + app.globalData.key_words);
    wx.request({
      url: api.AuthRegister,
      data: {
        pwd: pwd,
        tel: that.data.mobile,
        yzm: that.data.code,
        domain: 'www.bcxgps.com',
        ip :'',
        jm: jm.toUpperCase(),
        openid:that.data.openid
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
          setTimeout(function(){
            wx.navigateTo({
              url: '../../index/index',
            })
          },2000)

        }else if( res.data.result == 0){
          util.showToast('注册失败，请重试')
        }else if(res.data.result == 2){
          util.showToast('验证码超10分钟失效')
        } else if (res.data.result == 3) {
          util.showToast('手机号已注册')
        } else if (res.data.result == 4) {
          util.showToast('验证码无效')
        } else if (res.data.result == 5) {
          util.showToast('微信和平台账号绑定失败')
        }
      }
    });
  },
  bindUsernameInput: function (e) {

    this.setData({
      username: e.detail.value
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
  clearInput: function (e) {
    switch (e.currentTarget.id) {
      case 'clear-username':
        this.setData({
          username: ''
        });
        break;
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