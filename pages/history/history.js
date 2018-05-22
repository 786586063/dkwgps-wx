// pages/history/history.js
var api = require('../../config/api.js');
var util = require('../../utils/util.js');
var user = require('../../services/user.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: [],
    scal: 15,
    centerX: '121.565647',
    centerY: '29.824269',
    scrollHeight: '1000',
    datas: [],
    markers: [],
    polyline: [],
    info:{},
    distance:'0',
    distanceNow:'0',
    showModalStatus: false,
    showModalStatusForDateSelect:false,
    record:{
      his_time:'',//回放日期
      begin_end_time:'',//起始时间
      run_time:'',//行驶时间
      max_spe:'',//最高时速
      stop_time:'',//停止时间
      run_distance:''//行驶距离
    },
    display_history:'block',
    animationData2:''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.info(res.windowHeight);
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    
    that.getList('321234561200152', '2018/5/21 00:00:00', '2018/5/21 23:59:00')
  },
  select_data:function(){
    var that = this;
    // var currentStatu = e.currentTarget.dataset.statu;
    this.util("open")
  },
  selectTime:function(e){
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
      that.util2("open");
    }
    console.log('startTime:'+startTime+" endTime: "+endTime);
  },
  getList(sn, timestart, timeend) {
    var that = this;
    //  let datas = [];

    var sha1 = util.getSHA1(sn + app.globalData.key_words);
    var markers = that.data.markers;
    var polyline = that.data.polyline;
    wx.request({
      url: api.SelReplayG,
      data: {
        sn: sn,
        timestart: timestart,
        timeend: timeend,
        // isTX:"TX",
        jm: sha1.toUpperCase()
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

        console.log(JSON.stringify(res));
        if (res.data.result == 1) {
          polyline = that.getPolyline(res.data.datas);
          
          console.log(JSON.stringify(polyline))
          let markerData = [];
          let datas = res.data.datas;
          markerData.push(datas[0]);
          markerData.push(datas[datas.length -1]);
          let distance = datas[datas.length - 1].mil;
          markers = that.getMarkers(markerData)
          
          that.setData({
            polyline: polyline,
            datas: datas,
            centerX: datas[0].lon,
            centerY: datas[0].lat,
            markers: markers,
            distance: distance,
            info: datas[datas.length - 1]
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
  getMarkers(datas) {
    let markers = [];
    // let datas = this.data.allFocusTer
    let index = 0;
    for (let item of datas) {
      let marker = this.createMarker(item, index);
      markers.push(marker);
      index++;
    }
    return markers;
  },
  createMarker(point, id) {
    let latitude = point.lat;
    let longitude = point.lon;
    let lat = latitude;
    let lon = longitude;
    let ro = parseInt(point.dir);
   
    let carimg = '../../static/images/car_blue_fs.png';
    if (id == 1) {
      carimg = '../../static/images/history_start.png'
    }else if(id == 0){
      carimg = "../../static/images/history_end.png"

    }else{
      carimg = '../../static/images/car_blue_fs.png';
    }
     

    let marker = {
      iconPath: carimg,
      id: id,
      name: 'nihao',
      latitude: lat,
      longitude: lon,
      rotate: ro,
      width: 30,
      height: 30
    };
    return marker;
  },
  powerDrawer: function (e) {
    var that = this;
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },  
  powerDrawer2: function (e) {
    var that = this;
    var currentStatu = e.currentTarget.dataset.statu;
    this.util2(currentStatu)
  }, 
  startAndEnd:function(){
    var that = this;
    var markers = that.data.markers;
    console.log(markers);
    var datas = that.data.datas;
   
    var index = 1;
    var distance = that.data.distance;
    var inter= setInterval(function(){
      if(index < datas.length){
        var i = datas.length - index;
        var marker = that.createMarker(datas[i], 3)
        if (markers.length = 3) {
          markers.splice(3, 1);
        }
        markers.push(marker);
        //计算行驶的距离
        var distanceNow = (parseInt(datas[i].mil) - parseInt(distance))/1000;
        that.setData({
          markers: markers,
          centerX: datas[i].lon,
          centerY: datas[i].lat,
          info:datas[i],
          distanceNow: distanceNow
        })
      }else{
        clearInterval(inter);
        that.util("open");

      }
      index++;
    },1000);
    

  },
  upScal: function () {
    let that = this;
    let scal = that.data.scal;
    if (scal >= 5 && scal < 18) {
      scal++;
    } else {
      scal = 18;
    }
    that.setData({
      scal: scal
    });
  },
  downScal: function () {
    let that = this;
    let scal = that.data.scal;
    if (scal > 5 && scal <= 18) {
      scal--;
    } else {
      scal = 5;
    }
    that.setData({
      scal: scal
    });
  },
  getPolyline(datas) {
    let polylines = [];
    let points = [];
    // let datas = this.data.allFocusTer
    
    for(var i = 0; i < datas.length;i++){
      let point = {};
      point.latitude = datas[i].lat;
      point.longitude = datas[i].lon;
      points.push(point);
    }
    // for (let item of datas) {
    //   point.latitude = item.oldlat;
    //   point.longitude = item.oldlon;
    //   points.push(point);
    // }
    let polyline = {
      points: points,
      color: "#FF0000DD",
      width: 2,
      dottedLine: false
    }
    polylines.push(polyline)
    return polylines;
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
  util2: function (currentStatu) {
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
      animationData2: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画  
    setTimeout(function () {
      // 执行第二组动画  
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
      this.setData({
        animationData2: animation
      })

      //关闭  
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false,
            showModalStatusForDateSelect:false
          }
        );
      }
    }.bind(this), 200)

    // 显示  
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: false,
          showModalStatusForDateSelect:true
        }
      );
    }
  },
  // createPolyline(point, id) {
  //   let latitude = point.oldlat;
  //   let longitude = point.oldlon;
  //   let lat = latitude;
  //   let lon = longitude;
  //   // let ro = parseInt(point.dir);

  //   let polyline = {

  //     }
  //   };
  //   return polyline;
  // },

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