// index/index.js
var api = require('../../config/api.js');
var util = require('../../utils/util.js');
var user = require('../../services/user.js');
const MENU_WIDTH_SCALE = 0.7;
const FAST_SPEED_SECOND = 100;
const FAST_SPEED_DISTANCE = 5;
const FAST_SPEED_EFF_Y = 50;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ui: {
      windowWidth: 0,
      menuWidth: 0,
      offsetLeft: 0,
      tStart: true
    },
    display:'none',
    fxIsOpen:'none',
    fximage:'../../static/images/right_30px.png',
    useravr:'../../static/images/Headportrait.png',
    usernike:'用户昵称'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log("onLoad")
    //检查是否登录
    user.checkLogin().then(() => {
      console.log("已登录")
      var userinfo = wx.getStorageSync('userInfo');
      wx.getStorageSync('userInfo')

      that.setData({
        usernike: userinfo.LoginName
      })

    }).catch(() => {
      if (wx.getStorageSync('userInfo') == null) {
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
    try {
      let res = wx.getSystemInfoSync()
      this.windowWidth = res.windowWidth;
      this.data.ui.menuWidth = this.windowWidth * MENU_WIDTH_SCALE;
      this.data.ui.offsetLeft = 0;
      this.data.ui.windowWidth = res.windowWidth;
      this.setData({ ui: this.data.ui })
    } catch (e) {
    }

  },
  appfx:function(){
    var that = this;
    if (this.data.fxIsOpen == 'none'){//展开
      that.setData({
        fximage:'../../static/images/up_30px.png',
        fxIsOpen: 'block'
      })
    }else{
      that.setData({
        fximage: '../../static/images/right_30px.png',
        fxIsOpen: 'none'
      })
    }
  },
  // handlerStart(e) {
  //   let { clientX, clientY } = e.touches[0];
  //   this.tapStartX = clientX;
  //   this.tapStartY = clientY;
  //   this.tapStartTime = e.timeStamp;
  //   this.startX = clientX;
  //   this.data.ui.tStart = true;
  //   this.setData({ ui: this.data.ui })
  // },
  // handlerMove(e) {
  //   let { clientX } = e.touches[0];
  //   let { ui } = this.data;
  //   let offsetX = this.startX - clientX;
  //   this.startX = clientX;
  //   ui.offsetLeft -= offsetX;
  //   if (ui.offsetLeft <= 0) {
  //     ui.offsetLeft = 0;
  //   } else if (ui.offsetLeft >= ui.menuWidth) {
  //     ui.offsetLeft = ui.menuWidth;
  //   }
  //   this.setData({ ui: ui })
  // },
  // handlerCancel(e) {
  //   // console.log(e);
  // },
  // handlerEnd(e) {
  //   this.data.ui.tStart = false;
  //   this.setData({ ui: this.data.ui })
  //   let { ui } = this.data;
  //   let { clientX, clientY } = e.changedTouches[0];
  //   let endTime = e.timeStamp;
  //   //快速滑动
  //   if (endTime - this.tapStartTime <= FAST_SPEED_SECOND) {
  //     //向左
  //     if (this.tapStartX - clientX > FAST_SPEED_DISTANCE) {
  //       ui.offsetLeft = 0;
  //     } else if (this.tapStartX - clientX < -FAST_SPEED_DISTANCE && Math.abs(this.tapStartY - clientY) < FAST_SPEED_EFF_Y) {
  //       ui.offsetLeft = ui.menuWidth;
  //     } else {
  //       if (ui.offsetLeft >= ui.menuWidth / 2) {
  //         ui.offsetLeft = ui.menuWidth;
  //       } else {
  //         ui.offsetLeft = 0;
  //       }
  //     }
  //   } else {
  //     if (ui.offsetLeft >= ui.menuWidth / 2) {
  //       ui.offsetLeft = ui.menuWidth;
  //     } else {
  //       ui.offsetLeft = 0;
  //     }
  //   }
  //   this.setData({ ui: ui })
  // },
  handlerPageTap(e) {
  
    this.hideview();
  },
  handlerAvatarTap(e) {
    let { ui } = this.data;
    if (ui.offsetLeft == 0) {
      ui.offsetLeft = ui.menuWidth;
      ui.tStart = false;
      this.setData({ 
        ui: ui ,
        display:'block'
        })
    }
  },
 
  // 遮拦  
  hideview: function () {
    this.setData({
      display: "none"

    })
    let { ui } = this.data;
    if (ui.offsetLeft != 0) {
      ui.offsetLeft = 0;
      this.setData({ ui: ui })
    }
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