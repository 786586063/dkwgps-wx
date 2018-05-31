// pages/selectdate/selectdate.js
var api = require('../../config/api.js');
var util = require('../../utils/util.js');
var user = require('../../services/user.js');



var app = getApp() 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModalStatus: false,
    date:'2018-05-23',
    startTime:'00:01',
    endTime:'23:59'
    // years: years,
    // year: date.getFullYear(),
    // months: months,
    // month: thisMon,
    // days: days,
    // day: thisDay,
    // value: [1, thisMon - 1, thisDay - 1, 0, 0],
    // hours: hours,
    // hour: "00",
    // minutes: minutes,
    // minute: "00",  
  },
 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  powerDrawer: function (e) {
    var that = this;
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
    var date = that.data.date;
    date = date.replace(/-/g, "/");
    var startTime = date+' '+that.data.startTime+":00";
    var endTime = date + ' '+that.data.endTime+":59";
    
    console.log('startTime:' + startTime + " endTime: " + endTime);
    that.setPreData(startTime, endTime);
    
  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例   
    var animation = wx.createAnimation({
      duration: 200,  //动画时长  
      timingFunction: "linear", //线性  
      delay: 0  //0则不延迟  
    });

    // 第2步：这个动画实例赋给当前的动画实例  
    this.animation = animation;

    // 第3步：执行第一组动画  
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存  
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画  
    setTimeout(function () {
      // 执行第二组动画  
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
      this.setData({
        animationData: animation
      })

      //关闭  
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示  
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  },
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      startTime: e.detail.value
    })
  },
  bindTimeChange2: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      endTime: e.detail.value
    })
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  selectTime: function (e) {
    var that = this;
    var date = e.currentTarget.dataset.date;
    console.log(date)
    var startTime = '';
    var endTime = '';
    var mydate  = new Date();
    if(date == 1){//今日回放
      var today = mydate.toLocaleDateString();
      // console.log(today);
      startTime = today+ ' 00:00:00';
      endTime = today + ' 23:59:59';
    }else if (date== 2){//昨日回放
      var day1 = new Date();
      day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000);
      // var s1 = day1.getFullYear() + "-" + (day1.getMonth() + 1) + "-" + day1.getDate();
      var yestoday = day1.toLocaleDateString();
      // console.log(yestoday);
      startTime = yestoday + ' 00:00:00';
      endTime = yestoday + ' 23:59:59';
    }else if(date == 3){ // 前日回放
      var day2 = new Date();
      day2.setTime(day2.getTime() - 24 * 60 * 60 * 1000*2);
      var yy = day2.toLocaleDateString();
      // console.log(yy);
      startTime = yy + ' 00:00:00';
      endTime = yy + ' 23:59:59';
    }else{//自定义回放
      that.util("open");
    }
    if(startTime != '' && endTime != ''){
      console.log('startTime:' + startTime + " endTime: " + endTime);


      that.setPreData(startTime, endTime);
      
    }
   
    // var currPage = pages[pages.length - 1];   //当前页面
   
  },  
  setPreData: function (startTime, endTime){
    var that = this;
    var date = that.data.date;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    var sn = prevPage.data.sn;
    var begin_end_time =startTime.split(' ')[1] +'-'+endTime.split(' ')[1]
    prevPage.setData({
      record: {
        his_time: date,
        begin_end_time: begin_end_time
      }
    });
    prevPage.getList(sn, startTime, endTime);
  
    wx.navigateBack();   //返回上一个页面
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