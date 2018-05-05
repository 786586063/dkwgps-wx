// index/index.js
var api = require('../../config/api.js');
var util = require('../../utils/util.js');
var user = require('../../services/user.js');
var start_clientX;
var end_clientX;  
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: wx.getSystemInfoSync().windowWidth  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onLoad")
    //检查是否登录
    user.checkLogin().then(() => {
      console.log("已登录")

    }).catch(() => {
      if (wx.getStorageInfoSync('userinfo') == null){
        console.log("未登录")
        wx.showToast({
          title: '检测到您未登录，正在跳转至登录界面，请稍等。。。',
          icon: 'none',
          duration: 2000
        })
        setTimeout(function () {
          wx.navigateTo({
            url: '../auth/login/login',
          })
        }, 2000)
      }
     

    });
  
  },
  // 滑动开始  
  touchstart: function (e) {
    start_clientX = e.changedTouches[0].clientX
  },
  // 滑动结束  
  touchend: function (e) {
    end_clientX = e.changedTouches[0].clientX;
    if (end_clientX - start_clientX > 120) {
      this.setData({
        display: "block",
        translate: 'transform: translateX(' + this.data.windowWidth * 0.7 + 'px);'
      })
    } else if (start_clientX - end_clientX > 0) {
      this.setData({
        display: "none",
        translate: ''
      })
    }
  },
  // 头像  
  showview: function () {
    this.setData({
      display: "block",
      translate: 'transform: translateX(' + this.data.windowWidth * 0.7 + 'px);'
    })
  },
  // 遮拦  
  hideview: function () {
    this.setData({
      display: "none",
      translate: '',
    })
  }  ,
  tap_ch: function (e) {
    this.setData({
      display: "block",
      translate: 'transform: translateX(' + this.data.windowWidth * 0.7 + 'px);'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    console.log("onReady")
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("onShow")
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