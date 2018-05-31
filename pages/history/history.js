// pages/history/history.js
var api = require('../../config/api.js');
var util = require('../../utils/util.js');
var user = require('../../services/user.js');
var app = getApp();
var index = 1;
var inter = '';
var timeout = 1000;
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
    showModalStatusForDateSelect:true,
    record:{
      his_time:'',//回放日期
      begin_end_time:'',//起始时间
      run_time:'',//行驶时间
      max_spe:'',//最高时速
      stop_time:'',//停止时间
      run_distance:''//行驶距离
    },
    display_history:'block',
    animationData2:'',
    sn:'321234561200152',
    slider:{
      max:'',
      value:''

    },
    se:'../../static/images/history_stop.png',
    rate:32,
    tname:''

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
          scrollHeight: res.windowHeight-55
        });
      }
    });
    //获取页面传过来的值
    var sn = options.sn;
    var tname = options.tname;
    console.log(sn)
    that.setData({
      sn:sn,
      tname: tname
    })
    // that.getList(sn, '2018/5/21 00:00:00', '2018/5/21 23:59:00')
    wx.showModal({
      title: '提示',
      content: '是否跳转至时间选择界面？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.navigateTo({
            url: '../selectdate/selectdate'
            
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  switchRate:function(e){
   var that =this;
   var rate = that.data.rate;
   console.log(rate);
   if(rate <= 32){
     rate = rate * 2;
   }else{
     rate = 16;
   }
   that.setData({
     rate: rate
   })
    if(rate == 16){
      timeout = 1000;
    }else if(rate == 32){
      timeout = 500;
    }else if(rate == 64){
      timeout = 200;
    }
    clearInterval(inter);
    var se = '../../static/images/history_stop.png'
    that.setData({
      se: se
    })
    that.startAndEnd();
   
  },
  select_data:function(){
    var that = this;
    // var currentStatu = e.currentTarget.dataset.statu;
    // this.util("open")
    wx.navigateTo({
      url: '../selectdate/selectdate',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
 
  getList(sn, timestart, timeend) {
    var that = this;
    //  let datas = [];

    var sha1 = util.getSHA1(sn + app.globalData.key_words);
    var markers = that.data.markers;
    var polyline = that.data.polyline;
    var record = that.data.record;
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
          //结束时间
          let endtime = datas[0].gpstime;
          //结束时的距离
          let endDistance = datas[0].mil;

          markerData.push(datas[datas.length -1]);
          let distance = datas[datas.length - 1].mil;//开始时的距离
          //开始时间
          let starttime = datas[datas.length - 1].gpstime
          //计算总共行驶的距离
          let totalmil = (parseInt(endDistance) - parseInt(distance))/1000
          markers = that.getMarkers(markerData)
          //位record赋值
          record.stop_time =endtime.split(' ')[1];
          record.run_distance = totalmil;
          record.run_time = that.timeFn(starttime, endtime);
          //更新数据
          that.setData({
            polyline: polyline,
            datas: datas,
            centerX: datas[0].lon,
            centerY: datas[0].lat,
            markers: markers,
            distance: distance,
            info: datas[datas.length - 1],
            record: record
          })
        }
        else if (res.data.result == 0) {
          // util.showToast('没有搜索到回放数据,请重新选择！')
          wx.showModal({
            title: '提示',
            content: '没有搜索到回放数据,是否跳转至时间选择界面？',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.navigateTo({
                  url: '../selectdate/selectdate'

                })
              } else if (res.cancel) {
                console.log('用户点击取消')
                wx.navigateTo({
                  url: '../index/index'

                })
              }
            }
          })
        } else {
          util.showToast('请求出错！')

        }
      }

    });

  },
  timeFn: function(d1,d2) {//di作为一个变量传进来
    //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
    var dateBegin = new Date(d1);//将-转化为/，使用new Date
    var dateEnd = new Date(d2);//获取当前时间
    var dateDiff = dateEnd.getTime() - dateBegin.getTime();//时间差的毫秒数
    var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天数
    var leave1= dateDiff % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
    var hours= Math.floor(leave1 / (3600 * 1000))//计算出小时数
    //计算相差分钟数
    var leave2= leave1 % (3600 * 1000)    //计算小时数后剩余的毫秒数
    var minutes= Math.floor(leave2 / (60 * 1000))//计算相差分钟数
    //计算相差秒数
    var leave3= leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数
    var seconds= Math.round(leave3 / 1000)
    console.log(" 相差 " + dayDiff + "天 " + hours + "小时 " + minutes + " 分钟" + seconds + " 秒")
    var time = '';
    if(dayDiff != 0){
      time = dayDiff+'天';
    }
    if(hours != 0){
      time =time+ hours+'小时';
    }
    if(minutes != 0){
      time = time + minutes+'分钟';
    }
    if(seconds != 0){
      time = time+seconds+'秒';
    }
    return time;
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
    let ro = '0';
    // let starttime = '';
    // let endtime = '';
   
    let carimg = '../../static/images/car_blue_fs.png';
    if (id == 1) {//开始时间
      carimg = '../../static/images/history_start.png'
      // starttime =  point.gpstime.split(' ')[1]
    }else if(id == 0){//结束时间
      carimg = "../../static/images/history_end.png"
      // endtime = point.gpstime.split(' ')[1]
    }else{
      carimg = '../../static/images/car_blue_fs.png';
      ro=parseInt(point.dir)
    }
     

    let marker = {
      iconPath: carimg,
      id: id,
      name: 'nihao',
      latitude: lat,
      longitude: lon,
      rotate: ro,
      width: 30,
      height: 30,
      anchor: { x: .5, y: .5 } 
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
    var date = that.data.record.his_time;
    if(date != null && date != ''){
      var se = that.data.se;
      if (se == '../../static/images/history_stop.png') {//开始 
        var markers = that.data.markers;
        // console.log(markers);
        var datas = that.data.datas;
        var record = that.data.record;

        var max_spe = 0;
        var distance = that.data.distance;
        var slider = that.data.slider;
        slider.max = datas.length;
        se = '../../static/images/history_play.png'
        inter = setInterval(function () {
          if (index < datas.length) {
            var i = datas.length - index;
            var marker = that.createMarker(datas[i], 3)
            if (markers.length = 3) {
              markers.splice(3, 1);
            }
            markers.push(marker);
            //计算行驶的距离
            var distanceNow = (parseInt(datas[i].mil) - parseInt(distance)) / 1000;
            //计算最高行驶速度
            var spe = parseInt(datas[i].spe)
            if (spe > max_spe) {
              max_spe = spe;
            }
            record.max_spe = max_spe;
            //更新slider
            slider.value = index;
            that.setData({
              markers: markers,
              centerX: datas[i].lon,
              centerY: datas[i].lat,
              info: datas[i],
              distanceNow: distanceNow,
              record: record,
              slider: slider,
              se: se
            })
          } else {
            clearInterval(inter);
            that.util("open");
            index = 1;
            se = '../../static/images/history_stop.png'
            that.setData({
              se: se
            })
          }
          index++;
        }, timeout);
      } else {
        clearInterval(inter);
        se = '../../static/images/history_stop.png'
        that.setData({
          se: se
        })
      }
    }else{
      util.showToast('您还未选择回放的日期！')
    }
    
   
   
    

  },
  selectSlider:function(e){
    console.log(e.detail.value);
    index = e.detail.value;
    
  },
  listenerSlider:function(e){
    console.log(e.detail.value);
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
      color: "#FF5858DD",
      width: 10,
      dottedLine: false,
      arrowLine:true,
      arrowIconPath:'../../static/images/history_arrow.png'
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