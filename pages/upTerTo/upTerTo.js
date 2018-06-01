// pages/upTerTo/upTerTo.js
var api = require('../../config/api.js');
var util = require('../../utils/util.js');
var user = require('../../services/user.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    t_id:'',
    tname:'',
    parent: '',
    loginname:''
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var t_id = options.t_id;
    var tname = options.tname;
    var parent = options.parent;
  
    // var userinfo = wx.getStorageSync('userInfo');

    // console.log(userinfo);
    this.setData({
      tname:tname,
      parent: parent,
      t_id:t_id
    })
  },
  bindUserNameInput:function(e){
    console.log(e.detail.value)
    this.setData({
      loginname:e.detail.value
    })
  },
  accountLogin:function(){
    var that = this;
    var sha1 = util.getSHA1(that.data.t_id + app.globalData.key_words);
    wx.request({
      url: api.Bcx_upTerTo,
      data: {
        t_id:that.data.t_id,
        loginname: that.data.loginname,
        jm: sha1.toUpperCase()
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if(res.data.result==1){
          util.showToast('转移成功！')
        }else if(res.data.result == 3){
          util.showToast('账号不存在！')
        } else if (res.data.result == 0) {
          util.showToast('转移失败！')
        }
       
      },
      fail:function(res){
        util.showToast('接口请求失败！')
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
  
  }
})