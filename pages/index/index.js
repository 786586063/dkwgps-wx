// index/index.js
var api = require('../../config/api.js');
var util = require('../../utils/util.js');
var user = require('../../services/user.js');
var WxNotificationCenter = require('../../utils/WxNotificationCenter.js');
const MENU_WIDTH_SCALE = 0.7;
const FAST_SPEED_SECOND = 100;
const FAST_SPEED_DISTANCE = 5;
const FAST_SPEED_EFF_Y = 50;
var app = getApp();
var interval= null;
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
    display: 'none',
    display2: 'block',
    fxIsOpen: 'none',
    fximage: '../../static/images/right_30px.png',
    useravr: '../../static/images/Headportrait.png',
    usernike: '用户昵称',
    pull_content: '加载中。。。',
    allFocusTer: [],
    markers: [],
    scal: 5,
    centerX: '',
    centerY: '',
    terInfo: {},
    include: [],
    address: '',
    scrollHeight: '1000',
    location_btn: 'location1_btn',
    eyes_btn: 'eyes_btn',
    noFocusSelected:false,
    otherFunction:true,
    isinclude:false
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
          scrollHeight: res.windowHeight - 40
        });
      }
    });
    WxNotificationCenter.addNotification('NotificationName', that.didNotification, that) 
    //检查是否登录
    var userinfo = wx.getStorageSync('userInfo');
    if (userinfo != null && userinfo != '') {

      //获取账号下的总设备
      let vtcount = userinfo.vtcount;
      if(vtcount >0){
        if(userinfo.focus > 0){
          that.getTerList(userinfo.vid, vtcount, "0", '', '', userinfo.isvir)
        }else{
          util.showToast('检测到您还未关注车辆，请前往车辆列表选取一台进行关注！')

          setTimeout(function () {
            wx.navigateTo({
              url: '../terminalList/terminalList',
            })
          }, 2000)
        }
        
      }else{
        util.showToast('检测到您账号下还未绑定设备，请先前往绑定！')

        setTimeout(function () {
          wx.navigateTo({
            url: '../addterminal/addterminal',
          })
        }, 2000)
      }
      
     
      // if (vtcount < 30) {
      //   if(vtcount >0){
      //     //标注所有车，定位到中心车
         
      //   }else{
        
      //   }
       

      // } else { //只显示关注的车
      //   let focus = userinfo.focus;
      //   if (focus > 0) {

      //     //有关注 显示所有关注车，定位中心  
      //     that.getAllFocusTer(userinfo.vid, focus, '0', '', '', userinfo.isvir)
      //   } else {//无关注，进列表选一辆关注
      //     that.getTerList(userinfo.vid, "30", "0", '', '', userinfo.isvir)
      //     util.showToast('检测到您还未关注车辆，请前往车辆列表选取一台进行关注！')

      //     setTimeout(function () {
      //       wx.navigateTo({
      //         url: '../terminalList/terminalList',
      //       })
      //     }, 2000)

      //   }
      // }
      // interval = setInterval(function () {
      //   var noFocusSelected = that.data.noFocusSelected;
      //   if(noFocusSelected){
      //     that.getTerList(userinfo.vid, vtcount, "0", '', '', userinfo.isvir)
      //   }else{
      //     if (vtcount < 30) {
      //       //标注所有车，定位到中心车
      //       that.getTerList(userinfo.vid, vtcount, "0", '', '', userinfo.isvir)

      //     } else { //只显示关注的车
      //       let focus = userinfo.focus;
      //       if (focus > 0) {

      //         //有关注 显示所有关注车，定位中心  
      //         that.getAllFocusTer(userinfo.vid, focus, '0', '', '', userinfo.isvir)
      //       } else {//无关注，进列表选一辆关注
      //         that.getTerList(userinfo.vid, "30", "0", '', '', userinfo.isvir)
      //         util.showToast('检测到您还未关注车辆，请前往车辆列表选取一台进行关注！')

      //         setTimeout(function () {
      //           wx.navigateTo({
      //             url: '../terminalList/terminalList',
      //           })
      //         }, 2000)

      //       }
      //     }
      //   }
        
      // }, 10 * 1000);
      that.setData({
        usernike: userinfo.nickname
        // useravr: userinfo.headimg
      });


    } else {
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
  onUnload: function () {
    //移除通知
    var that = this
    WxNotificationCenter.removeNotification('NotificationName', that)
  },
  didNotification:function(obj){

  },

  more_btn:function(){
    this.setData({
      otherFunction:false
    })
  },
  switchUser: function () {
    wx.clearStorageSync('userInfo');
    wx.navigateTo({
      url: '../auth/login/login'
    })
  },
  nac_ter_detail: function () {
    var that = this;
    var terInfo = that.data.terInfo;
    console.log(terInfo);
    var sn = terInfo.sn;
    var parent = terInfo.parent;
    var t_id = terInfo.t_id;
    wx.navigateTo({
      url: '../terminalDetail/terminalDetail?sn=' + sn + '&parent=' + parent + '&t_id=' + t_id
    })
  },
  navigation: function () {
    var that = this;
    var terInfo = that.data.terInfo;

    wx.openLocation({
      latitude: parseFloat(terInfo.glat),
      longitude: parseFloat(terInfo.glon),
      scale: 18,
      name: terInfo.address,
      address: that.data.address
    })
  },
  openHistory: function () {
    var that = this;
    var terInfo = that.data.terInfo;
    console.log(terInfo);
    var sn = terInfo.sn;
    var tname = terInfo.tname;
    wx.navigateTo({
      url: '../history/history?sn=' + sn + '&tname=' + tname,
    })
  },
  incloude: function () {
    var that = this;
    let include = that.data.include;
    let markers = that.data.markers;
    that.setData({
      include: markers,
      scal: 5,
      isinclude:true
    });
  },
  localtion: function () {
    var that = this;
    var location_btn = that.data.location_btn;
    if (location_btn == 'location1_btn') {//定位到自己的位置
      wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success: (res) => {
          console.log(res)
          let latitude = res.latitude;
          let longitude = res.longitude;

          this.setData({
            centerX: longitude,
            centerY: latitude,
            scal: 15,
            location_btn: 'location2_btn'
          })
        }
      });
    } else {//移动至选中车辆坐标
      let center = wx.getStorageSync('centerTer');
      if (center != null && center != '') {//有中心车
        let centerX = center.longitude;
        let centerY = center.latitude;
        this.setData({
          centerX: centerX,
          centerY: centerY,
          scal: 15,
          location_btn: 'location1_btn'
        })
      }

    }

  },
  isOpenCallout: function () {
    var that = this;
    var eyes_btn = that.data.eyes_btn;
    var markers = that.data.markers;
    if (eyes_btn == 'eyes_btn') { //打开标签
      for (var item of markers) {
        item.callout.display = 'BYCLICK';
      }

      that.setData({
        markers: markers,
        eyes_btn: 'eyes_locked_btn'
      })
    } else { //关闭
      for (var item of markers) {
        item.callout.display = 'ALWAYS';
      }

      that.setData({
        markers: markers,
        eyes_btn: 'eyes_btn'
      })
    }
  },
  addterminal: function () {

    wx.navigateTo({
      url: '../addterminal/addterminal',
    })
  },
  markertap: function (e) {
    var id = e.markerId;
    var that = this;
    var allData = that.data.allFocusTer;
    var markers = that.data.markers;
    var selectTer ={};
    for(var item of allData){
      if(item.tname == markers[id].callout.content){
        selectTer = item;
        break;
      }
    }
    //更改中心车位置
    var centerX = markers[id].longitude;
    var centerY = markers[id].latitude;
    //改变选中marker的颜色
    // console.log(markers[id])
    for (var i = 0; i < markers.length; i++) {
      if (i == id) {
        markers[i].callout.color = "#FF5858";
      } else {
        markers[i].callout.color = "#666666"
      }
    }

    this.getAddress(centerX, centerY)
    //把选中的目标车缓存在本地
    wx.setStorageSync('centerTer', markers[id]);
    that.setData({
      centerX: centerX,
      centerY: centerY,
      scal: 15,
      terInfo: selectTer,
      markers: markers,
      isinclude:false
    });

  },
  nav_infomation: function () {
    wx.navigateTo({
      url: '../information/information',
    })
  },
  getAddress: function (lon, lat) {
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
    var isinclude = that.data.isinclude;
    var userinfo = wx.getStorageSync('userInfo');
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
          
          let center = wx.getStorageSync('centerTer');
          let m =[];
          if (that.data.noFocusSelected){
            m.push(center);
          }else{ 
            m = that.getMarkers(allFocusTer)
          }   
          let terInfo = {};
          let scal = '15';
          if (center == null || center == '') {
           
            for (var item of allFocusTer ){
              if (item.tname == m[0].callout.content){
                terInfo = item;
                break;
              }
            }
            centerX = m[0].longitude;
            centerY = m[0].latitude;
          } else {

            centerX = center.longitude;
            centerY = center.latitude;
            for (var i = 0; i < m.length; i++) {
              if (m[i].callout.content == center.callout.content) {
                m[i].callout.color = "#FF5858";
                // terInfo = allFocusTer[i];
                break;
              }
            }
            for (var item of allFocusTer) {
              if (item.tname == center.callout.content) {
                terInfo = item;
                break;
              }
            }
            scal = 15;
          }
          that.getAddress(centerX, centerY)
          that.setData({
            allFocusTer: allFocusTer,
            markers: m,
            centerX: centerX,
            centerY: centerY,
            terInfo: terInfo
            // scal: scal
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
    var isinclude = that.data.isinclude;
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

        // console.log("设备列表:" + JSON.stringify(res));
        if (res.data.result == 1) {
         
          allFocusTer = res.data.datas;
          console.log(allFocusTer[0])
          let m = that.getMarkers(allFocusTer)
          // if (isinclude){
          //   that.setData({
          //     include:m
          //   })
          // }else{
            let centerX = '';
            let centerY = '';
            // console.log(res.data.datas.length)
            // allFocusTer = res.data.datas;
            // let m = that.getMarkers(allFocusTer)
            // console.log(m)
            let terInfo = '';
            let center = wx.getStorageSync('centerTer');
            // console.log()
            let scal = that.data.scal;
            if (center == null || center == '') {
              console.log(allFocusTer[0]);
              terInfo = allFocusTer[0];
              centerX = m[0].longitude;
              centerY = m[0].latitude;

            } else {
              for (var item of allFocusTer) {
                if (item.tname == center.name) {
                  terInfo = item;
                }
              }

              centerX = center.longitude;
              centerY = center.latitude;
              for (var i = 0; i < m.length; i++) {
                if (m[i].callout.content == center.name) {
                  m[i].callout.color = "#FF5858";
                }
              }
              // scal = 15;
            }
            that.getAddress(centerX, centerY)
            that.setData({
              allFocusTer: allFocusTer,
              markers: m,
              centerX: centerX,
              centerY: centerY,
              terInfo: terInfo
              // scal: scal
            })
          // }
         

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
    if (datas.length < 30) {
      for (let item of datas) {
          let marker = this.createMarker(item, index);
          markers.push(marker);
          index++;
      }
    }else{
      for (let item of datas) {
        if (item.focus == 1) {
          let marker = this.createMarker(item, index);
          markers.push(marker);
          index++;
        }
      }
    }
    
    return markers;
  },
  createMarker(point, id) {
    let latitude = point.glat;
    let longitude = point.glon;
    let lat = parseFloat(latitude);
    let lon = parseFloat(longitude);
    let ro = parseInt(point.dir);
    parseInt()
    let carimg = '';
    let carimggz = point.carimggz;
    if (carimggz == '汽车灰fs') {
      carimg = "../../static/images/car_gray_fs.png"
    } else if (carimggz == '汽车蓝fs') {
      carimg = "../../static/images/car_blue_fs.png"
    } else if (carimggz == '汽车绿fs') {
      carimg = "../../static/images/car_blue_fs.png"
    } else if (carimggz == '摩托蓝fs') {
      carimg = "../../static/images/motuo_blue_fs.png"
    } else if (carimggz == '摩托灰fs') {
      carimg = "../../static/images/motuo_gray_fs.png"
    } else if (carimggz == '摩托绿fs') {
      carimg = "../../static/images/motuo_green_fs.png"
    } else {
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
      anchor: { x: .5, y: .5 },
      callout: {
        content: point.tname,
        color: '#666666',
        fontSize: 12,
        x: -20,
        y: -60,
        bgColor: '#ffffff',
        padding: 10,
        borderRadius: 5,
        // borderWidth:20,
        display: 'ALWAYS',
        textAlign: 'center'
      }
    };
    return marker;
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
  appfx: function () {
    var that = this;
    if (this.data.fxIsOpen == 'none') {//展开
      that.setData({
        fximage: '../../static/images/up_30px.png',
        fxIsOpen: 'block'
      })
    } else {
      that.setData({
        fximage: '../../static/images/right_30px.png',
        fxIsOpen: 'none'
      })
    }
  },
  transfer_btn:function(){
    var that  = this;
    var terInfo = that.data.terInfo;
    console.log(terInfo);
    var t_id = terInfo.t_id;
    var tname = terInfo.tname;
    var parent = terInfo.parent
    wx.navigateTo({
      url: '../upTerTo/upTerTo?t_id='+t_id+'&tname='+tname+'&parent='+parent,
      complete: function (res) { 
        that.setData({
          otherFunction:true
        })
      }
     
    })
   
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
        ui: ui,
        display: 'block',
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
  openTerList: function () {
    clearInterval(interval)
    wx.navigateTo({
      url: '../terminalList/terminalList',
    })
  },


  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '伴车星',
      path: 'pages/index/index',
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },
  drawerPic2Save: function () {
    wx.navigateTo({
      url: '../share/share',
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

    var that = this;
    var markers = that.data.markers;
    that.setdata({
      markers:markers
    })
    var userinfo = wx.getStorageSync('userInfo');
    interval = setInterval(function () {
      var noFocusSelected = that.data.noFocusSelected;
      //获取账号下的总设备
      let vtcount = userinfo.vtcount;
      if (vtcount > 0) {
        if (userinfo.focus > 0) {
          that.getTerList(userinfo.vid, vtcount, "0", '', '', userinfo.isvir)
        } 
      } 

    }, 10 * 1000);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(interval);
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