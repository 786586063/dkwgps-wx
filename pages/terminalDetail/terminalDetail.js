// pages/terminalDetail/terminalDetail.js
var api = require('../../config/api.js');
var util = require('../../utils/util.js');
var user = require('../../services/user.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sn:'',
    terInfo:{},
    parent:'',
    tname:'',
    sim:'',
    chepai:'',
    t_id:'',
    imgxf:'../../static/images/renew_48px.png',
    wlkHidden:false,
    ptHidden:false,
    dxHidden:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var sn = options.sn;
    var parent = options.parent;
    var t_id = options.t_id;
    console.log(sn);
    that.setData({
      sn:sn,
      parent: parent,
      t_id: t_id
    })
     //请求网络
    var userinfo = wx.getStorageSync('userInfo');
    that.getTerDetail(sn,userinfo.vid)
    //判断是否显示充值按钮
    var wlkHidden = that.data.wlkHidden;
    var ptHidden = that.data.ptHidden;
    var dxHidden = that.data.dxHidden;
    var msgxf = userinfo.msgxf; //短信续费
    var simxf = userinfo.simxf; //物联卡续费
    var terxf = userinfo.terxf; //平台续费
    var showendtime = userinfo.showendtime; //是否显示平台到期时间
    if(msgxf == '1'){
      dxHidden = true;
    }
    if (simxf == '1'){
      wlkHidden = true;
    }
    if(terxf == '1'){
      ptHidden = true;
    }
    if(showendtime == '1'){
      var terInfo = that.data.terInfo;
      terInfo.endtime=''
    }
    //请求网络查看是否可以续费

  },
  xf:function(){
    wx.navigateTo({
      url: '../recharge/recharge',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  bindTnameInput:function(e){

    this.setData({
      tname: e.detail.value
    });
  },
  bindSimInput:function(e){
    this.setData({
      sim: e.detail.value
    });
  },
  bindchepaiInput:function(e){
    this.setData({
      chepai: e.detail.value
    });
  },
  btn_save:function(){
    var that = this;
    var tname = that.data.tname;
    var t_id = that.data.t_id;
    var sim = that.data.sim;
    var chepai = that.data.chepai;
    var terInfo = that.data.terInfo;
    if(tname.length <= 0){
      tname = terInfo.tname;
    }
     if(sim.length <= 0){
      sim = terInfo.sim
    }
    if(chepai.length <=0){
      chepai = terInfo.chepai
    }
    that.upTerInfo(t_id, tname, sim, terInfo.simpwd,chepai);
    console.log(tname);
  },
  upTerInfo: function (t_id, tname, sim,simpwd, chepai){
    var jm = util.getSHA1(t_id + app.globalData.key_words);
    wx.request({
      url: api.UpTerInfo,
      data: {
        t_id: t_id,
        tname: tname,
        sim: sim,
        simpwd: simpwd,
        bz: chepai,
        jm: jm.toUpperCase()
       
      },
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
      
        if (res.data.result == 1) {
          util.showToast('更改成功！')

        } else if (res.data.result == 0) {
          util.showToast('更改失败！')
        }
        else if (res.data.result == 3) {
          util.showToast('设备名重复！')
        }
      }
    });
  },
  getTerDetail(sn, vip_id) {
    var that = this;
    var terInfo = that.data.terInfoL;
    var sha1 = util.getSHA1(sn + app.globalData.key_words);
    wx.request({
      url: api.SelTerInfo,
      data: {
        sn: sn,
        vip_id: vip_id,
        jm: sha1.toUpperCase()
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

        // console.log("设备列表:" + JSON.stringify(res));
        if (res.data.result == 1) {
          console.log(res);
          terInfo = res.data.datas;
          var wlkHidden = that.data.wlkHidden;
          var ptHidden = that.data.ptHidden;
          if (terInfo.endtime.split('-')[0] == '2030'){
            terInfo.endtime = '终身';
            //隐藏平台续费按钮'
            ptHidden = true;
          }
          if(terInfo.simvers!= '0' || terInfo.simvers == '4'){//物联网卡，显示续费按钮
            wlkHidden = false;
          }else{
            wlkHidden = true;
          }
          if (terInfo.autotime.split('-')[0] == '2030'){
            terInfo.autotime = '终身'
            //隐藏物联卡到期续费按钮
            wlkHidden = false;
          }
          that.setData({
            terInfo:terInfo,
            wlkHidden: wlkHidden,
            ptHidden: ptHidden
          })

        }
        else if (res.data.result == 0) {
          util.showToast('没有更多数据了')
        } else {
          util.showToast('请求出错！')

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
  
  }
})