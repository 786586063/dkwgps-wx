// pages/addterminal/addterminal.js
var api = require('../../config/api.js');
var util = require('../../utils/util.js');
var user = require('../../services/user.js');

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tname:'',
    IMEI:''
  },
  bindIMEIInput:function(e){
    console.log(e.detail.value)
    this.setData({
      IMEI: e.detail.value
    })

  },
  bindTnameInput: function (e) {
    console.log(e.detail.value)
    this.setData({
      tname:e.detail.value
    })

  },
  scan_req:function(){
    var that = this;
    wx.scanCode({
      success: (res) => {
        console.log(res)
        var result = res.result;
        that.setData({
          IMEI:result
        })
      }
    })
  },
  btn_save:function(){
    var that = this;
    var IMEI = that.data.IMEI;
    var tname = that.data.tname;
    if(IMEI.length <=0){
      util.showToast('IMEI号码不能为空！')
    }else if(tname.length<=0){
      util.showToast('设备名不能为空！')
    }
    var userinfo = wx.getStorageSync('userInfo');
    that.addTer(IMEI,userinfo.vid,tname)
  },
  
  addTer(sn, vip_id, tname) {
    var that = this;
    //  let datas = [];

    var sha1 = util.getSHA1(sn + app.globalData.key_words);
    wx.request({
      url: api.AddTer,
      data: {
        sn: sn,
        vip_id: vip_id,
        tname: tname,
        types:'wx',
        jm: sha1.toUpperCase()
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {

        //1添加成功，0sn不属于平台，2加密不匹配， 3失败，4设备名称重复，5sn已绑定， 500接口出错 
        if (res.data.result == 1) {
          util.showToast('添加成功')

        }
        else if (res.data.result == 0) {
          util.showToast('sn不属于平台')
        } else if (res.data.result == 4){
          util.showToast('设备名称重复')
        } else if (res.data.result == 5) {
          util.showToast('sn已绑定')
        }
        else {
          util.showToast('请求出错！')

        }
      }

    });

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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