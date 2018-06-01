function initSubMenuDisplay() {
  return ['hidden', 'hidden', 'hidden'];
}

function addZero(num) {
  return num < 10 ? '0' + num : num
}

function getMonth() {
  var today = new Date()
  var year = today.getFullYear()
  var month = today.getMonth() + 1
  var day = today.getDate()
  return addZero(month)
}

function getDateStr(today, addDayCount) {
  var dd;
  if (today) {
    dd = new Date(today);
  } else {
    dd = new Date();
  }
  dd.setDate(dd.getDate() + addDayCount);//获取AddDayCount天后的日期 
  var y = dd.getFullYear();
  var m = dd.getMonth() + 1;//获取当前月份的日期 
  var d = dd.getDate();
  if (m < 10) {
    m = '0' + m;
  };
  if (d < 10) {
    d = '0' + d;
  };
  return y + "/" + m + "/" + d + ' ' +'00:00:00';
}

var id;
var api = require('../../../config/api.js');
var md5 = require('../../../utils/md5.js');
var sha1 = require('../../../utils/sha1.js');
var util = require('../../../utils/util.js');
var app = getApp();
Page({
  data: {
    routers: [
      {
        name: '全部',
        sel: 'true',
        icon: '/static/images/btn_225px_normal.png',
        types:'1,2,3,4'
      },
      {
        name: '',
        sel: 'false',
        icon: '/static/images/btn_225px_normal.png',
        types: '1'
      },
      {
        name: '平台',
        sel: 'false',
        icon: '/static/images/btn_225px_normal.png',
        types: '2'
      },
      {
        name: '短信',
        sel: 'false',
        icon: '/static/images/btn_225px_normal.png',
        types: '3'
      },
      {
        name: '保险',
        sel: 'false',
        icon: '/static/images/btn_225px_normal.png',
        types: '4'
      },
      {
        name: '',
        sel: 'false',
        icon: ''
      }
    ],
    types:'全部',
    starttime:'2018/5/5',
    endtime: '2018/5/5',
    username: '',
    oldpwd: '',
    code: '',
    password: '',
    confirmPassword: '',
    subMenuDisplay: initSubMenuDisplay(),
    id: 0,
    color:'',
    array: [{}]
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    // 页面渲染完成
    var that = this;
    var today=new Date();
    var typeshaixuan='';
    var types = wx.getStorageSync('types');
    var startdate = wx.getStorageSync('startdate');
    var enddate = wx.getStorageSync('enddate');
    if (types==''){
        types='1,2,3,4'
    }
    if (startdate==''){
      startdate = getDateStr(today,-5)  
    }
    if (enddate == '') {
      enddate = today.getFullYear() + '/' + getMonth()+ '/'  + today.getDate()+' '+'00:00:00'
    }
    if(types=='1,2,3,4'){
         typeshaixuan='全部'
    } else if (types == '1'){
      typeshaixuan = '物联网卡'
    } else if (types == '2') {
      typeshaixuan = '平台'
    } else if (types == '3') {
      typeshaixuan = '短信'
    } else if (types == '4') {
      typeshaixuan = '保险'
    }
    that.setData({
      types: typeshaixuan,
      starttime: startdate.substring(0,startdate.indexOf(' ')),
      endtime: enddate.substring(0, startdate.indexOf(' ')),
      array: [{}]
    })
    console.log(types)
    console.log(startdate)
    console.log(enddate)
    var shajm = sha1.getSHA1('261' + '' + app.globalData.key_words).toUpperCase();
    console.log(shajm)
    wx.request({
      url: 'https://apiwx.dkwgps.com/userapi/Information/bcx_moneyRecord',
      data: {
        vip_id:'261',
        page:'0',
        count:'100',
        types: types,
        btime: startdate,
        etime: enddate,
        jm: shajm
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.data.datas!=null){
          for (var i = 0; i < res.data.datas.length; i++) {
            that.setData({
              ['array[' + i + '].money']: res.data.datas[i].price,
              ['array[' + i + '].types']: res.data.datas[i].contents,
              ['array[' + i + '].yuan']: '元',
              ['array[' + i + '].line']: 'line',
              ['array[' + i + '].time']: '时间:' + util.formatTime(new Date(res.data.datas[i].addtime))
            })
          }
        }else{
          that.setData({
            array:[{}]
          })
        }
        console.log(res.data)
      }

    })
  },
  onReady: function () {

  },
  onShow: function () {
    // 页面显示
    this.onLoad();
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  tapMainMenu: function (e) {//        获取当前显示的一级菜单标识
    var index = parseInt(e.currentTarget.dataset.index);        // 生成数组，全为hidden的，只对当前的进行显示
    var newSubMenuDisplay = initSubMenuDisplay();//        如果目前是显示则隐藏，反之亦反之。同时要隐藏其他的菜单
    if (this.data.subMenuDisplay[index] == 'hidden') {
      newSubMenuDisplay[index] = 'show';
    } else {
      newSubMenuDisplay[index] = 'hidden';
    }        // 设置为新的数组
    this.setData({
      subMenuDisplay: newSubMenuDisplay
    });
  },
  tapSubMenu: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    console.log(index);  // 隐藏所有一级菜单
    this.setData({
      subMenuDisplay: initSubMenuDisplay()
    });
  },
  tapSubMenu: function (e) {        // 隐藏所有一级菜单
    this.setData({
      subMenuDisplay: initSubMenuDisplay()
    });        // 处理二级菜单，首先获取当前显示的二级菜单标识
    var indexArray = e.currentTarget.dataset.index.split('-');        // 初始化状态
    // var newSubMenuHighLight = initSubMenuHighLight;
    for (var i = 0; i < initSubMenuHighLight.length; i++) {            // 如果点中的是一级菜单，则先清空状态，即非高亮模式，然后再高亮点中的二级菜单；如果不是当前菜单，而不理会。经过这样处理就能保留其他菜单的高亮状态
      if (indexArray[0] == i) {
        for (var j = 0; j < initSubMenuHighLight[i].length; j++) {                    // 实现清空
          initSubMenuHighLight[i][j] = '';
        }                // 将当前菜单的二级菜单设置回去
      }
    }        // 与一级菜单不同，这里不需要判断当前状态，只需要点击就给class赋予highlight即可
    initSubMenuHighLight[indexArray[0]][indexArray[1]] = 'highlight';        // 设置为新的数组
    this.setData({
      subMenuHighLight: initSubMenuHighLight
    });
  },
  choseTxtColor: function (e) {
    var id = e.currentTarget.dataset.id;  //获取自定义的ID值  
    this.setData({
      id: id
    })
  },
  back: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  switchs:function(e){
    var that = this;
    var id = e.target.id;
    for (var i = 0; i < this.data.routers.length; i++) {
      if (id != 5) {
        if(id==1){
          that.setData({
            color:'#ffffff',
          }) 
        }else{
          that.setData({
            color: '#000000',
          }) 
        }
      that.setData({
        ['routers[' + i + '].sel']: 'false',
      }) 
      if (i == id) {
        that.setData({
          ['routers[' + i + '].sel']: 'true',
        })
      }
    }
    }
  },
  shaixuan:function(){
    wx.navigateTo({
      url:''
    })
  },
  bindPasswordInput: function (e) {

    this.setData({
      password: e.detail.value
    });
  },
  bindConfirmPasswordInput: function (e) {

    this.setData({
      confirmPassword: e.detail.value
    });
  },
  bindoldPwdInput: function (e) {

    this.setData({
      oldpwd: e.detail.value
    });
  },
  bindCodeInput: function (e) {

    this.setData({
      code: e.detail.value
    });
  },
  clearInput: function (e) {
    switch (e.currentTarget.id) {
      case 'clear-password':
        this.setData({
          password: ''
        });
        break;
      case 'clear-confirm-password':
        this.setData({
          confirmPassword: ''
        });
        break;
      case 'clear-mobile':
        this.setData({
          mobile: ''
        });
        break;
      case 'clear-code':
        this.setData({
          code: ''
        });
        break;
    }
  }
})