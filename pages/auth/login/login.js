var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
var user = require('../../../services/user.js');

var app = getApp();
Page({
  data: {
    username: '',
    password: '',
    code: '',
    loginErrorCount: 0,
    remeber_pic:'/static/images/select_gray_30px.png',
    remeber_pic_pwd: '/static/images/select_gray_30px.png',
    open_pwd_pic:'/static/images/eyes_locked.png',
    rember_username:false,
    rember_password:false,
    pwd:true
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    // 页面渲染完成
    console.log(wx.getStorageSync("username"));
    var that = this;
    if(wx.getStorageSync("username")!=null){
      that.setData({
        username: wx.getStorageSync("username")
      });
    }
    console.log(wx.getStorageSync("password"));
    if (wx.getStorageSync("password")!=null){
      that.setData({
        password: wx.getStorageSync("password")
      });
    }
    if (wx.getStorageSync("rember_username")){
      that.setData({
        remeber_pic: '/static/images/select_blue_30px.png'
      });
    }
    if (wx.getStorageSync("rember_password")) {
      that.setData({
        remeber_pic_pwd: '/static/images/select_blue_30px.png'
      });
    }

  },
  onReady: function () {

  },
  onShow: function () {
    // 页面显示
    // if (app.globalData.hasLogin) {
    //   wx.navigateTo({
    //     url: '../../index/index',
    //   })
    // }
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  wxLogin: function () {
    user.checkLogin().catch(() => {

      user.loginByWeixin().then(res => {
        app.globalData.hasLogin = true;
        util.showSuccessToast('微信登录成功')
        setTimeout(function(){
          wx.navigateTo({
            url: '../../index/index',
          })
        },1000)
       
      }).catch((err) => {
        app.globalData.hasLogin = false;
        util.showErrorToast('微信登录失败');
      });

    });
  },
  accountLogin: function () {
    var that = this;

    if (this.data.password.length < 1 || this.data.username.length < 1) {
      wx.showModal({
        title: '错误信息',
        content: '请输入用户名和密码',
        showCancel: false
      });
      return false;
    }
    if (that.data.rember_username) {
      wx.setStorageSync("username", that.data.username)
    }
    if (this.data.rember_password) {
      wx.setStorageSync("password", that.data.password)
    }
    wx.request({
      url: api.LoginUrl,
      data: {
        username: that.data.username,
        password: util.getMd5(that.data.password),
        domain: 'www.bcxgps.com'
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        
        console.log("SSSS:" + JSON.stringify(res));
        if (res.data.result == 1){
          that.setData({
            loginErrorCount: 0
          });
          app.globalData.hasLogin = true;
          wx.setStorageSync('userInfo', res.data.datas);
          wx.setStorageSync('haslogin', true);
          var is =wx.getStorageInfoSync('userinfo')!=null;
          console.log(is);
          //登录成功，跳转至首页
          wx.navigateTo({
            url: '../../index/index',
          })
        }
        else{
          that.setData({
            loginErrorCount: that.data.loginErrorCount + 1
          });
          app.globalData.hasLogin = false;
          util.showErrorToast('账户登录失败');
        
        }
      }
    });
  },
  bindUsernameInput: function (e) {

    this.setData({
      username: e.detail.value
    });
    // if(this.data.rember_username){
    //   wx.setStorageSync("username", e.detail.value)
    // }
  },
  bindPasswordInput: function (e) {

    this.setData({
      password: e.detail.value
    });
    // if (this.data.rember_password) {
    //   wx.setStorageSync("password", e.detail.value)
    // }
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
      case 'clear-code':
        this.setData({
          code: ''
        });
        break;
    }
  },
  remeberusername:function(){
    var that = this;
    if (that.data.remeber_pic == '/static/images/select_blue_30px.png'){
      that.setData({
        remeber_pic: '/static/images/select_gray_30px.png',
        rember_username:false
      })
      wx.setStorageSync("rember_username", false)
      wx.removeStorageSync("username")
    } else { //记住账号
      that.setData({
        remeber_pic: '/static/images/select_blue_30px.png',
        rember_username: true
      })
      wx.setStorageSync("rember_username", true)
      console.log("记住账号")
    }
   
  },
  remeberpwd: function () {
    var that = this;
    if (that.data.remeber_pic_pwd == '/static/images/select_blue_30px.png') {
      that.setData({
        remeber_pic_pwd: '/static/images/select_gray_30px.png',
        rember_password:false
      })
      wx.setStorageSync("rember_password", false)
      
      wx.removeStorageSync("password")
    } else { //记住密码
      that.setData({
        remeber_pic_pwd: '/static/images/select_blue_30px.png',
        rember_password: true
      })
      wx.setStorageSync("rember_password", true)
      
      console.log("记住密码")
    }

  },
  openpwd:function(){
    var that = this;
    if (that.data.open_pwd_pic == '/static/images/eyes_locked.png') {
      that.setData({
        open_pwd_pic: '/static/images/eyes_btn.png',
        pwd:false
      })
     
    }else{
      that.setData({
        open_pwd_pic: '/static/images/eyes_locked.png',
        pwd:true

      })
    }
  }
})