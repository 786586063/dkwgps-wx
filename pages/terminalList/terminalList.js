// pages/terminalList/terminalList.js
var api = require('../../config/api.js');
var util = require('../../utils/util.js');
var user = require('../../services/user.js');
var WxNotificationCenter = require('../../utils/WxNotificationCenter.js');
var app = getApp() 

//获取设备列表
// var userinfo = wx.getStorageSync('userInfo');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /** 
         * 页面配置 
         */
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0, 
    terdata:[],
    pull_content:'加载中。。',
    hidden:true,
    page : 0,
    search:'',
    allData:[]
  },

  //   {
  //   tname: '',
  //   adress: '',
  //   carimg: ''
  // }
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    });
    wx.showLoading({
      title: '正在加载。。。',
    })
    //获取设备列表
    let userinfo = wx.getStorageSync('userInfo');
    this.getTerList(userinfo.vid, '30', that.data.page, '', that.data.search, userinfo.isvir)
   
    
  },
  navcat : function(){
    wx.navigateBack({
      delta: 1
    })
  },
  bindPasswordInput:function(e){
    this.setData({
      search: e.detail.value
    });
    
  },
  btn_search :function(){
    var that = this;
    that.setData({
      terdata: [],
      hidden: true,
      page: 0
    });
    let search = that.data.search;
    let userinfo = wx.getStorageSync('userInfo');
    this.getTerList(userinfo.vid, '30', '0', '', search, userinfo.isvir)

  },
  bindfocus : function(e){
    var that = this;
    let id = e.currentTarget.dataset.id;
    console.log("id: "+ id);
     let data = that.data.terdata;
     let vid = data[id].vip_id;
     let sn = data[id].sn;
     let focus = data[id].focus =='follow_gray_30px' ? 1:0;
     var sha1 = util.getSHA1(vid + app.globalData.key_words);
     wx.request({
       url: api.UpTerFocus,
       data: {
         vip_id: vid,
         sn: sn,
         focus: focus,
         jm: sha1.toUpperCase()
       },
       method: 'POST',
       header: {
         'content-type': 'application/json'
       },
       success: function (res) {

         // console.log("设备列表:" + JSON.stringify(res));
         if (res.data.result == 1) {
           util.showToast('操作成功！')
           if(focus == 0){
             data[id].focus = 'follow_gray_30px';
           }else{
             data[id].focus = 'follow_red_30px';
           }
           that.setData({
             terdata: data
           });
          
          
         }
         else if (res.data.result == 0) {
           util.showToast('操作失败！')
         } else if (res.data.result == 3){
           util.showToast('关注设备达到上限！')

         }
       }

     });
     
  },
  selectTer : function(e){
    var that = this;
    // WxNotificationCenter.postNotificationName('NotificationName', obj)
    var pages = getCurrentPages();
    var markersdata = [];
    // var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    var allData = that.data.allData;
    var id = e.currentTarget.dataset.id;
    // console.log(allData);
    //判断设备是否被关注，关注了显示所有关注的，定位到点击的
    var focus = allData[id].focus;
     console.log(allData[id]);
    // var preMarkers = prevPage.data.markers;
    var preMarkers = prevPage.getMarkers(allData)
   
    var centerX = '';
    var centerY = '';

    
    if(focus == 1){
      for (var i = 0; i < preMarkers.length; i++) {
        if (preMarkers[i].callout.content == allData[id].tname) {
          preMarkers[i].callout.color = "#FF5858";
          centerX = preMarkers[i].longitude;
          centerY = preMarkers[i].latitude;
          wx.setStorageSync('centerTer', preMarkers[i])
         
          console.log(allData[id])
          console.log(preMarkers[i])
          break;
        } 
       
      }
     
    } else {//首页没有 没有关注，只显示点击的
      markersdata.push(allData[id]);
      preMarkers = prevPage.getMarkers(markersdata)
      preMarkers[0].callout.color = "#FF5858";
      console.log(preMarkers[0])
      centerX = preMarkers[0].longitude;
      centerY = preMarkers[0].latitude;
      wx.setStorageSync('centerTer', preMarkers[0])
      prevPage.setData({
        noFocusSelected:true
      });
    }
    prevPage.getAddress(centerX, centerY);
    prevPage.setData({
      centerX: centerX,
      centerY: centerY,
      markers:preMarkers,
      terInfo : allData[id],
      scal:18
    });
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function(){
      wx.navigateBack();   //返回上一个页面
      wx.hideLoading()
    },1000)
    
  },
  getTerList:function(vid,cout,page,sn,search,isvir){
    var that = this;
  //  let datas = [];
    
    var sha1 = util.getSHA1(vid + app.globalData.key_words);
    var terlist = null;
    var allData = null;
    if(search.length>0){
      allData = [];
      terlist = [];
    }else{
      allData = that.data.allData;
      terlist = that.data.terdata;
    }

    wx.request({
      url: api.SelTerList,
      data: {
        vid:vid,
        count:cout,
        page:page,
        order:'addtime',
        sn:sn,
        search:search,
        isvir:isvir,
        jm: sha1.toUpperCase()
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
       
        // console.log("设备列表:" + JSON.stringify(res));
        if (res.data.result == 1) {
         
          console.log(res.data.datas)
          for (let i = 0; i < res.data.datas.length; i++) {

            let data = {
              tname: res.data.datas[i].tname,
              address: res.data.datas[i].address,
              carimg: res.data.datas[i].carimg == '' || res.data.datas[i].carimg == null ? 'sjc_leaved_zx' : res.data.datas[i].carimg,
              focus: res.data.datas[i].focus == '1' ? 'follow_red_30px' : 'follow_gray_30px',
              vip_id: res.data.datas[i].vip_id,
              sn : res.data.datas[i].sn
            }
            terlist.push(data);
            allData.push(res.data.datas[i])
          }
          // console.log(JSON.stringify(datas))
         
        
          if (res.data.datas.length < 30 ){
            //没有更多数据了
            that.setData({
              hidden: false,
              pull_content:'没有更多数据了'
            });
          }
          that.setData({
            terdata: terlist,
            allData: allData,
            search:''
          });
          wx.hideLoading()
        }
        else if (res.data.result == 0) {
        
          that.setData({
            hidden: false,
            pull_content: '没有更多数据了'
          });
          util.showToast('没有更多数据了')
          wx.hideLoading()
        }else{
          util.showToast('请求出错！')
          wx.hideLoading()

        }
      }
      
    });
    
  },
  topLoad :function(){
    // util.showToast('没有更多数据了')
  },
  bindDownLoad : function(){
    // util.showToast('没有更多数据了2')
  },
  /** 
     * 滑动切换tab 
     */
  bindChange: function (e) {

    var that = this;
    that.setData({ currentTab: e.detail.current });

  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  }  ,

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("下拉刷新")
    var that = this;
     this.setData({
          terdata : [],
          hidden: true,
          page : 0
    });
    var userinfo = wx.getStorageSync('userInfo');
    this.getTerList(userinfo.vid, '30', '0', '',that.data.search , userinfo.isvir)
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    let page = that.data.page +1;
    that.setData({
      hidden: false,
      page : page
   });

    console.log("上拉加载")
    var userinfo = wx.getStorageSync('userInfo');
    this.getTerList(userinfo.vid, '30', page, '', that.data.search, userinfo.isvir)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})