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
    display2: 'block',
    fxIsOpen:'none',
    fximage:'../../static/images/right_30px.png',
    useravr:'../../static/images/Headportrait.png',
    usernike:'用户昵称',
    pull_content:'加载中。。。',
    allFocusTer:[],
    markers:[],
    scal:5,
    centerX:'',
    centerY:'',
    terInfo:{},
    include:[],
    address:'',
    scrollHeight:'1000'
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
          scrollHeight: res.windowHeight-40
        });
      }
    });
    this.mapCtx = wx.createMapContext('myMap')
    //检查是否登录
    var userinfo = wx.getStorageSync('userInfo');
    if(userinfo != null&& userinfo != ''){

      //获取账号下的总设备
      let vtcount = userinfo.vtcount;

      let centerX = '';
      let centerY = '';
      if (vtcount < 30) {
        //标注所有车，定位到中心车
        this.getTerList(userinfo.vid, vtcount, "0", '', '', userinfo.isvir)

      } else { //只显示关注的车
        let focus = userinfo.focus;
        if (focus > 0) {

          //有关注 显示所有关注车，定位中心  
          this.getAllFocusTer(userinfo.vid, focus, '0', '', '', userinfo.isvir)
        } else {//无关注，进列表选一辆关注
          this.getTerList(userinfo.vid, "30", "0", '', '', userinfo.isvir)
          util.showToast('检测到您还未关注车辆，请前往车辆列表选取一台进行关注！')

          setTimeout(function () {
            wx.navigateTo({
              url: '../terminalList/terminalList',
            })
          }, 2000)

        }


        //没有关注，从列表点进去只显示这一辆车
      }

      // //判断有没有中心车
      let center = wx.getStorageSync('centerTer');
      if (center != null && center != '') {//有中心车
        centerX = center.oldlon;
        centerY = center.oldlat;
      }
      // else {//没有中心车
      //   let markers = that.data.markers;
      //   console.log(JSON.stringify(markers))
      //   if (centerTer != null && centerTer != '') {//有中心车
      //     centerY = centerTer.latitude;
      //     centerX = centerTer.longitude;
      //   } else {
      //     centerY = markers[0].latitude;
      //     centerX = markers[0].longitude;
      //   }
      // }
      that.setData({
        centerX: centerX,
        centerY: centerY,
        usernike: userinfo.nickname
      });


    }else{
      wx.showToast({
        title: '检测到您未登录，正在跳转至登录界面，请稍等。。。',
        icon: 'none',
        duration: 1000
      })
      setTimeout(function () {
        wx.navigateTo({
          url: '../auth/login/login',
        })
      }, 1000)
    }
   
    // user.checkLogin().then(() => {
    //   console.log("已登录")
      

    // }).catch(() => {
    //   // if (wx.getStorageSync('userInfo') == null) {
    //     // console.log("未登录")
    //     wx.showToast({
    //       title: '检测到您未登录，正在跳转至登录界面，请稍等。。。',
    //       icon: 'none',
    //       duration: 2000
    //     })
    //     setTimeout(function () {
    //       wx.navigateTo({
    //         url: '../auth/login/login',
    //       })
    //     }, 2000)
    //   // }


    // });
    try {
      let res = wx.getSystemInfoSync()
      this.windowWidth = res.windowWidth;
      this.data.ui.menuWidth = this.windowWidth * MENU_WIDTH_SCALE;
      this.data.ui.offsetLeft = 0;
      this.data.ui.windowWidth = res.windowWidth;
      this.setData({ ui: this.data.ui })
    } catch (e) {
    }
   
    //创建marker


  },
  openHistory:function(){
    wx.navigateTo({
      url: '../history/history',
    })
  },
  incloude:function(){
    var that = this;
    let include = that.data.include;
    let markers = that.data.markers;
    that.setData({
      include : markers
    });
  },
  localtion:function(){
    var that = this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: (res) => {
        console.log(res)
        let latitude = res.latitude;
        let longitude = res.longitude;
        
        this.setData({
          centerX: longitude,
          centerY: latitude,
          scal :15
        })
      }
    });
  },
  markertap:function(e){
    var id = e.markerId;
    var that = this;
    var allData = that.data.allFocusTer;
    var markers = that.data.markers;
    var selectTer = allData[id];
    //更改中心车位置
    var centerX = selectTer.oldlon;
    var centerY = selectTer.oldlat;
    //改变选中marker的颜色
    console.log(markers[id])
    for(var i = 0 ; i < markers.length;i++){
      if(i == id){
        markers[i].callout.color = "#FF5858";
      }else{
        markers[i].callout.color = "#666666"
      }
    }

    this.getAddress(centerX, centerY)
    //把选中的目标车缓存在本地
    wx.setStorageSync('centerTer', selectTer);
    that.setData({
      centerX: centerX,
      centerY: centerY,
      scal : 14,
      terInfo: selectTer,
      markers:markers
    });
    
  },
  nav_infomation : function(){
    wx.navigateTo({
      url: '../information/information',
    })
  },
  getAddress:function(lon, lat){
   var that = this;
    wx.request({
      url: api.GetAddressDetail,
      data: {
        lon: lon,
        lat: lat
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

        // console.log("设备列表:" + JSON.stringify(res));
        if (res.data.result == 1) {
          console.log(res.data.address);
         that.setData({
           address: res.data.address
         })
        }
      }
    })
  },
  getTerList(vid, cout, page, sn, search, isvir) {
    var that = this;
    //  let datas = [];

    var sha1 = util.getSHA1(vid + app.globalData.key_words);

    var allFocusTer = that.data.allFocusTer;
    wx.request({
      url: api.SelTerList,
      data: {
        vid: vid,
        count: cout,
        page: page,
        order: 'addtime',
        sn: sn,
        search: search,
        isvir: isvir,
        jm: sha1.toUpperCase()
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

        // console.log("设备列表:" + JSON.stringify(res));
        if (res.data.result == 1) {
          let centerX = '';
          let centerY = '';
          console.log(res.data.datas.length)
          allFocusTer = res.data.datas;
          let m = that.getMarkers(allFocusTer)
          let terInfo = '';
          let center = wx.getStorageSync('centerTer');
          // console.log()
          let scal = '13';
          if (center == null || center == '') {
            console.log(allFocusTer[0]);
            terInfo = allFocusTer[0];
            centerX = m[0].longitude;
            centerY = m[0].latitude;
            
            // terInfo.address = util.getAddress(centerX, centerY);
          } else {
            terInfo = center;
            centerX = center.oldlon;
            centerY = center.oldlat;
            for (var i = 0; i < m.length; i++) {
              if (m[i].callout.content == center.tname) {
                m[i].callout.color = "#FF5858";
              }
            }
            scal = 16;
          }
          that.getAddress(centerX, centerY)
          that.setData({
            allFocusTer: allFocusTer,
            markers: m,
            centerX: centerX,
            centerY: centerY,
            terInfo: terInfo,
            scal: scal
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
  getAllFocusTer(vid, cout, page, sn, search, isvir) {
    var that = this;
    //  let datas = [];

    var sha1 = util.getSHA1(vid + app.globalData.key_words);
    var allFocusTer = that.data.allFocusTer;
    wx.request({
      url: api.SelTerFocusList,
      data: {
        vid: vid,
        count: cout,
        page: page,
        order: 'addtime',
        sn: sn,
        search: search,
        isvir: isvir,
        jm: sha1.toUpperCase()
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

        console.log("设备列表:" + JSON.stringify(res));
        if (res.data.result == 1) {
          let centerX = '';
          let centerY = '';
          console.log(res.data.datas.length)
          allFocusTer = res.data.datas;
          let m =that.getMarkers(allFocusTer)
          let terInfo = '';
          let center = wx.getStorageSync('centerTer');
          // console.log()
          let scal = '13';
          if(center == null || center == ''){
            console.log(allFocusTer[0]);
            terInfo = allFocusTer[0];
            centerX = m[0].longitude;
            centerY = m[0].latitude;
           
          }else{
            terInfo = center;
            centerX = center.oldlon;
            centerY = center.oldlat;
            for(var i = 0;i < m.length;i++){
              if (m[i].callout.content == center.tname){
                m[i].callout.color ="#FF5858";
              }
            }
            scal = 16;
          }
          that.getAddress(centerX, centerY)
          that.setData({
            allFocusTer: allFocusTer,
            markers: m,
            centerX: centerX,
            centerY: centerY,
            terInfo: terInfo,
            scal : scal
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
  createMarker(point,id) {
    let latitude = point.oldlat;
    let longitude = point.oldlon;
    let lat = latitude;
    let lon = longitude;
    let ro = parseInt(point.dir);
    parseInt()
    let carimg = '';
    let carimggz = point.carimggz;
    if (carimggz =='汽车灰fs'){
      carimg = "../../static/images/car_gray_fs.png"
    } else if (carimggz == '汽车蓝fs'){
      carimg = "../../static/images/car_blue_fs.png"
    } else if (carimggz == '汽车绿fs'){
      carimg = "../../static/images/car_blue_fs.png"
    } else if (carimggz == '摩托蓝fs'){
      carimg = "../../static/images/motuo_blue_fs.png"
    } else if (carimggz == '摩托灰fs') {
      carimg = "../../static/images/motuo_gray_fs.png"
    }else {
      carimg = "../../static/images/" + carimggz + "d.png"
    }
    let marker = {
      iconPath: carimg,
      id: id,
      name: point.tname,
      latitude: lat,
      longitude: lon,
      rotate: ro,
      width: 30,
      height: 30,
      callout : {
        content: point.tname,
        color: '#666666' ,
        fontSize:12,
        x:-20,
        y:-60,
        bgColor:'#ffffff',
        padding:10,
        borderRadius:5,
        // borderWidth:20,
        display:'ALWAYS',
        textAlign: 'center'
      }
    };
    return marker;
  },
  upScal : function(){
    let that = this;
    let scal = that.data.scal;
    if(scal >=5 && scal < 18){
      scal++;
    }else{
      scal = 18;
    }
    that.setData({
      scal : scal
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
  handlerStart(e) {
    let { clientX, clientY } = e.touches[0];
    this.tapStartX = clientX;
    this.tapStartY = clientY;
    this.tapStartTime = e.timeStamp;
    this.startX = clientX;
    this.data.ui.tStart = true;
    this.setData({ ui: this.data.ui })
  },
  handlerMove(e) {
    let { clientX } = e.touches[0];
    let { ui } = this.data;
    let offsetX = this.startX - clientX;
    this.startX = clientX;
    ui.offsetLeft -= offsetX;
    if (ui.offsetLeft <= 0) {
      ui.offsetLeft = 0;
    } else if (ui.offsetLeft >= ui.menuWidth) {
      ui.offsetLeft = ui.menuWidth;
    }
    this.setData({ ui: ui })
  },
  handlerCancel(e) {
    // console.log(e);
  },
  handlerEnd(e) {
    this.data.ui.tStart = false;
    this.setData({ ui: this.data.ui })
    let { ui } = this.data;
    let { clientX, clientY } = e.changedTouches[0];
    let endTime = e.timeStamp;
    //快速滑动
    if (endTime - this.tapStartTime <= FAST_SPEED_SECOND) {
      //向左
      if (this.tapStartX - clientX > FAST_SPEED_DISTANCE) {
        ui.offsetLeft = 0;
      } else if (this.tapStartX - clientX < -FAST_SPEED_DISTANCE && Math.abs(this.tapStartY - clientY) < FAST_SPEED_EFF_Y) {
        ui.offsetLeft = ui.menuWidth;
      } else {
        if (ui.offsetLeft >= ui.menuWidth / 2) {
          ui.offsetLeft = ui.menuWidth;
        } else {
          ui.offsetLeft = 0;
        }
      }
    } else {
      if (ui.offsetLeft >= ui.menuWidth / 2) {
        ui.offsetLeft = ui.menuWidth;
      } else {
        ui.offsetLeft = 0;
      }
    }
    this.setData({ ui: ui })
  },
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
        display:'block',
        display2: 'none'
        })
    }
  },
 
  // 遮拦  
  hideview: function () {
    this.setData({
      display: "none",
      display2: 'block'
    })
    let { ui } = this.data;
    if (ui.offsetLeft != 0) {
      ui.offsetLeft = 0;
      this.setData({ ui: ui })
    }
  },
  openTerList: function(){
    wx.navigateTo({
      url: '../terminalList/terminalList',
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