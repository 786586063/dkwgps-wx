// pages/information/information.js
var api = require('../../config/api.js');
var util = require('../../utils/util.js');
var user = require('../../services/user.js');

var app = getApp() 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pull_content: '加载中。。',
    hidden: true,
    scrollHeight:'',
    page: 0,
    hidden_delect:true,
    delect_image:'/static/images/delete_30px.png',
    allDatas:[],
    scrollTop:100,
    longTapStatus: false,
    delectIds:[],
    delctIndexs:[],
    delect:[],
    showModalStatus: false,
    checkbox:[],  
    touch_end :'',
    touch_end:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // wx.getSystemInfo({
    //   success: function (res) {
    //     console.info(res.windowHeight);
    //     let height = res.windowHeight;
    //     wx.createSelectorQuery().selectAll('.header .view-yzm').boundingClientRect(function (rects) {
    //       rects.forEach(function (rect) {
    //         that.setData({
    //           scrollHeight: res.windowHeight - rect.bottom - rect.height
    //         });
    //       })
    //     }).exec();
    //   }
    // });
    // wx.getSystemInfo({
    //   success: function (res) {
    //     console.info(res.windowHeight);
    //     that.setData({
    //       scrollHeight: res.windowHeight-200
    //     });
    //   }
    // });  
    // this.getInfomationList(userinfo.vid,that.data.page,'30')
    let types = '99,2,4,5,6,7,8,9,11,12,13,14,16'
    var userinfo = wx.getStorageSync('userInfo');
    that.getListWithTypes(userinfo.vid, '', that.data.page, '30', types);
  
  },
  checkboxChange:function(e){
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    var that= this;
    var checkbox = that.data.checkbox;
    that.setData({
      checkbox: e.detail.value
    })
  },
  delect_one:function(e){
    var that = this;
    var status = that.data.longTapStatus;
    // var delectIds = [];
    // var delctIndexs=[];
    let delect =that.data.delect;
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let alldata = that.data.allDatas;
    let obj ={};
    if(status){ //多个删除状态
      // console.log('多个删除')
      //判断数组里面是否已经存在
      let ishas = false;
      for(let i= 0 ; i< delect.length;i++){
        if(delect[i].id == id){
          delect.splice(i,1);
          ishas = true;
        }
      }
      if(!ishas){
        obj.id = id;
        obj.index = index;
        delect.push(obj);
        alldata[index].img = '/static/images/select_blue_30px.png'
      }else{
        alldata[index].img = '/static/images/select_gray_30px.png'
      }
      
      that.setData({
       delect:delect,
       allDatas:alldata
      })
      console.log(JSON.stringify(delect))
    }else{
     
      console.log(e.currentTarget.dataset.index);
      this.delectOne(id, index);
    }
    

  },
  delectOne(id,index){
    var that = this;
    var sha1 = util.getSHA1(id + app.globalData.key_words);
    var allDatas = that.data.allDatas;
    wx.request({
      url: api.MessageCenterDelOne,
      data: {
        id: id,
        jm: sha1.toUpperCase()
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {

        // console.log("设备列表:" + JSON.stringify(res));
        if (res.data.result == 1) {
          util.showToast('删除成功！')
          // wx.startPullDownRefresh();
          allDatas.splice(index,1);
          that.setData({
            allDatas: allDatas,
            delect:[]
          })
        }
        else if (res.data.result == 0) {
          util.showToast('删除失败！')
         
        } else {
          util.showToast('接口出错！')

        }
      }

    });
  },
  topLoad : function(){
    console.log('下拉刷新！')
   
    wx.startPullDownRefresh();
    
  },
  // scroll: function (event){
  //   this.setData({
  //     scrollTop: event.detail.scrollTop
  //   });  
  // },
  bindDownLoad:function(){
    console.log('上拉刷新！')
    var that = this;
    let page = that.data.page + 1;
    that.setData({
      hidden: false,
      page: page
    });
    // this.getInfomationList(userinfo.vid, that.data.page, '20');
    let types = '99,2,4,5,6,7,8,9,11,12,13,14,16'
    var userinfo = wx.getStorageSync('userInfo');
    that.getListWithTypes(userinfo.vid, '', that.data.page, '20', types);

  },
  getInfomationList(vid,page,count){
    var that = this;
    var sha1 = util.getSHA1(vid + app.globalData.key_words);
    var allDatas = that.data.allDatas;
    var islongdelect = that.data.hidden_delect;
    wx.request({
      url: api.MessageCenter,
      data: {
        vip_id: vid,
        page: page,
        count: count,
        jm: sha1.toUpperCase()
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

        // console.log("设备列表:" + JSON.stringify(res));
        if (res.data.result == 1) {
          // console.log(JSON.stringify(res.data.datas))
          // allDatas.push(res.data.datas)
          for(let item of res.data.datas){
            if (!islongdelect){
              item.img = '/static/images/select_gray_30px.png'
            }else{
              item.img = '/static/images/delete_30px.png'
            }
           
            allDatas.push(item);
          }
          that.setData({
            allDatas: allDatas
          });

        }
        else if (res.data.result == 0) {
          util.showToast('无数据！')
          that.setData({
            hidden: false,
            pull_content: '没有更多数据了'
          });
        } else {
          util.showToast('接口出错！')

        }
      }

    });
  },
  //按下事件开始  
  mytouchstart: function (e) {
    let that = this;
    that.setData({
      touch_start: e.timeStamp
    })
    console.log(e.timeStamp + '- touch-start')
  },
  //按下事件结束  
  mytouchend: function (e) {
    let that = this;
    that.setData({
      touch_end: e.timeStamp
    })
    console.log(e.timeStamp + '- touch-end')
  },  
  longTap:function(){
    var that = this;
    var isHidden = that.data.hidden_delect;
    var alldata = that.data.allDatas;
    var longTapStatus = '';
    var delect_image = '';
    if (isHidden){//隐藏
      isHidden = false;
      // delect_image = '/static/images/select_gray_30px.png';
      for(let item of alldata){
        item.img = '/static/images/select_gray_30px.png'
      }
      longTapStatus = true;
    }else{
      isHidden = true;
      // delect_image = '/static/images/delete_30px.png';
      for (let item of alldata) {
        item.img = '/static/images/delete_30px.png'
      }
      longTapStatus:false;
    }
    that.setData({
      hidden_delect: isHidden,
      delect_image: delect_image,
      longTapStatus: longTapStatus,
      allDatas:alldata,
      delect:[]
    })
  },
  nav_bac :function(){
    wx.navigateBack();   //返回上一个页面
  },
  clickItem:function(e){
    var that = this;
    //触摸时间距离页面打开的毫秒数  
    var touchTime = that.data.touch_end - that.data.touch_start;
    console.log(touchTime);  
    if (touchTime > 350){
      that.longTap()
    }else{
    
      var datas = that.data.allDatas;
      var index = e.currentTarget.dataset.index;
      var item = datas[index];
      //打开地图，并在地图上标记点
      var str = JSON.stringify(item);
      wx.navigateTo({
        url: '../map/map?item=' + str,
      })
    }
   
  },
  delect_select:function(){
    var that = this;
    var delect = that.data.delect;
    console.log(JSON.stringify(delect));
    var alldata = that.data.allDatas;
    for(let item of delect){
      that.delectOne(item.id, item.index);
    }

    // delect_image = '/static/images/delete_30px.png';
    for (let item of alldata) {
      item.img = '/static/images/delete_30px.png'
    }

    that.setData({
      longTapStatus:false,
      hidden_delect:true,
      allDatas:alldata
    })
  },
  powerDrawer: function (e) {
    var that = this;
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
    var checkbox = that.data.checkbox;
    if(checkbox !=null && checkbox.length > 0){
      //拼接type
      let dot = '';
      for(let types of checkbox){
        dot+=types + ',';
      }
      dot = dot.substring(0,dot.length -1);
      that.setData({
        allDatas:[]
      })
      var userinfo = wx.getStorageSync('userInfo');
      that.getListWithTypes(userinfo.vid,'','0','30',dot);
    }

  },  
  getListWithTypes:function(vid,tname,page,count,types){
    var that = this;
    var sha1 = util.getSHA1(vid + app.globalData.key_words);
    var allDatas = that.data.allDatas;
    var islongdelect = that.data.hidden_delect;
    wx.request({
      url: api.Bell_messageCenterBySN,
      data: {
        vip_id: vid,
        tname: tname,
        page: page,
        count: count,
        types: types,
        jm: sha1.toUpperCase()
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

        // console.log("设备列表:" + JSON.stringify(res));
        if (res.data.result == 1) {
          // console.log(JSON.stringify(res.data.datas))
          // allDatas.push(res.data.datas)
          for (let item of res.data.datas) {
            if (!islongdelect) {
              item.img = '/static/images/select_gray_30px.png'
            } else {
              item.img = '/static/images/delete_30px.png'
            }

            allDatas.push(item);
          }
          that.setData({
            allDatas: allDatas
          });
          // if (res.data.datas.length < 20) {
          //   //没有更多数据了
          //   that.setData({
          //     hidden: false,
          //     pull_content: '没有更多数据了'
          //   });
          // }

        }
        else if (res.data.result == 0) {
          util.showToast('无数据！')
          that.setData({
            hidden: false,
            pull_content: '没有更多数据了'
          });
        } else {
          util.showToast('接口出错！')

        }
      }

    });
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
  }  ,
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("下拉")
    var that = this;
    var status = that.data.longTapStatus;
    if (!status){
      this.setData({
        allDatas: [],
        delect:[],
        hidden: true,
        page: 0
      });
      // this.getInfomationList(userinfo.vid, that.data.page, '20')
      let types = '99,2,4,5,6,7,8,9,11,12,13,14,16'
      var userinfo = wx.getStorageSync('userInfo');
      that.getListWithTypes(userinfo.vid, '', that.data.page, '20', types);
      
     
    }
    wx.stopPullDownRefresh();
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