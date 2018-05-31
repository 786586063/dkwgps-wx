// pages/auth/reset/resetthree/resetthree.js
var api = require('../../../../config/api.js');
var util = require('../../../../utils/util.js');
var user = require('../../../../services/user.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:'',
    pwdone:'',
    pwdtwo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var username = options.username
    this.setData({
      username:username
    })
    console.log(username)
  },
  bindPasswordInput:function(e){
    this.setData({
      pwdone: e.detail.value
    });
  },
  bindPasswordtwoInput:function(e){
    this.setData({
      pwdtwo: e.detail.value
    });
  },
  enterNext:function(){
    var that = this;
    var pwdone = that.data.pwdone;
    var pwdtwo = that.data.pwdtwo;
    var username = that.data.username;

    if(pwdone.length >0 && pwdtwo.length > 0){
      if(pwdone == pwdtwo){
        var sha1 = util.getSHA1(username + app.globalData.key_words);
        var pwd = util.getMd5(pwdone);
        wx.request({
          url: api.ResetPwd,
          data: {
            pwd: pwd,
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
              util.showToast('重置成功！')
              // wx.getStorageSync("username")
              wx.setStorageSync('username', username)
              setTimeout(function(){
                wx.navigateTo({
                  url: '../../login/login'
                })
              },2000)

            } else if (res.data.result == 0) {//验证码发送失败
              util.showToast('重置失败！')
            } else {//半小时发送超过三次不太发送
              util.showToast('其他失败！')
            }
          }
        });
      }else{
        util.showToast('密码不一致！')
      }
    }else{
      util.showToast('输入项不能为空')
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