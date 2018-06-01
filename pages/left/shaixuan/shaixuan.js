

var id;
var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
var app = getApp();
Page({
  data: {
    timelastclick: 'm_0',
    typelastclick:'img_0',
    startdate: '2017-05',
    enddate: '2017-05',
    week: ['日', '一', '二', '三', '四', '五', '六'],
    months: [{}],
    types:'',
    selyear:'',
    selmonth: '',
    selday: '',
    selweek: '今天',
    selyeartwo: '',
    selmonthtwo: '',
    seldaytwo: '',
    selweektwo: '今天',
    routers: [
      {
        name: '全部',
        sel: 'true',
        icon: '/static/images/btn_225px_normal.png',
        types:'1,2,3,4'
      },
      {
        name: '物联网卡',
        sel: 'false',
        icon: '/static/images/btn_225px_normal.png' ,
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
        icon: '',
        types: ''
      }
    ],
    username: '',
    oldpwd: '',
    code: '',
    password: '',
    confirmPassword: '',
    subMenuDisplay: 'hidden',
    subMenuDisplaytwo: 'hidden',
    id: 0
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    // 页面渲染完成
    var currentDate = util.getCurrentDate()
    this.setData({
      startdate: util.getselDate(currentDate.getFullDate()),
      enddate: util.getselDate(currentDate.getFullDate()),
      dateCN: util.translateFormateDate(currentDate.getYearMonth()),
      months: util.generateDays(currentDate.getYearMonth()),
      selyear: util.getYear(),
      selmonth: util.getMonth(),
      selday: util.getDay(),
      selyeartwo: util.getYear(),
      selmonthtwo: util.getMonth(),
      seldaytwo: util.getDay()
    })
  },
  onReady: function () {

  },
  onShow: function () {
    // 页面显示

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  bindPickerChange: function (e) {
    this.setData({
      months: util.generateDays(e.detail.value),
      startdate: util.getselDate(e.detail.value),
      dateCN: util.translateFormateDate(e.detail.value),
      selyear: util.yearDate(e.detail.value),
      selmonth: util.monthDate(e.detail.value)
    })
  },

  bindPickerChangetwo: function (e) {
    this.setData({
      months: util.generateDays(e.detail.value),
      enddate: util.getselDate(e.detail.value),
      dateCN: util.translateFormateDate(e.detail.value),
      selyeartwo: util.yearDate(e.detail.value),
      selmonthtwo: util.monthDate(e.detail.value)
    })
  },

  bindNextMonth: function () {
    this.setData({
      startdate: util.nextMonth(this.data.date),
      dateCN: util.translateFormateDate(nextMonth(this.data.date)),
      months: util.generateDays(nextMonth(this.data.date))
    })
  },

  bindLastMonth: function () {
    this.setData({
      startdate: util.lastMonth(this.data.date),
      dateCN: util.translateFormateDate(lastMonth(this.data.date)),
      months: util.generateDays(lastMonth(this.data.date))
    })
  },
  click: function (e) {
    var that = this;
    var id = e.target.id;
    for (var i = 0; i < this.data.months.length; i++) {
      if (id != ''){
        if (e.currentTarget.dataset.item.num != '') {
          that.setData({
            ['months[' + i + '].startsel']: 'false',
          })
        }
        if ('m' + i == id && e.currentTarget.dataset.item.num != '') {
          that.setData({
            ['months[' + i + '].startsel']: 'true',
          })
        }
      }  
    }
    if (e.currentTarget.dataset.item.num != '' && id != '') {
      this.setData({
        startdate: util.getselDate(e.currentTarget.dataset.item.value),
        selday: e.currentTarget.dataset.item.num,
        selweek: util.getWeek(e.currentTarget.dataset.item.value),
      })
    }
  },
  clicktwo: function (e) {
    var that = this;
    var id = e.target.id;
    for (var i = 0; i < this.data.months.length; i++) {
      if (id != '') {
      if (e.currentTarget.dataset.item.num != '') {
        that.setData({
          ['months[' + i + '].endsel']: 'false',
        })
      }
      if ('m' + i == id && e.currentTarget.dataset.item.num != '') {
        that.setData({
          ['months[' + i + '].endsel']: 'true',
        })
      }
    }
    }
    if (e.currentTarget.dataset.item.num != ''&&id!='') {
      this.setData({
        enddate: util.getselDate(e.currentTarget.dataset.item.value),
        seldaytwo: e.currentTarget.dataset.item.num,
        selweektwo: util.getWeek(e.currentTarget.dataset.item.value)
      })
    }
  },
  confirm:function(e){
    wx.setStorageSync('types', this.data.types)
    wx.setStorageSync('startdate', this.data.startdate+' '+'00:00:00')
    wx.setStorageSync('enddate', this.data.enddate + ' ' + '00:00:00')
    wx.navigateBack({
      
    })
  },
  cancel: function (e) {
    wx.navigateBack({
      delta:1
    })
  },  
  tapMainMenu: function (e) {//        获取当前显示的一级菜单标识
    var newSubMenuDisplay = 'hidden';
    if (this.data.subMenuDisplay == 'hidden') {
      newSubMenuDisplay = 'show';
    } else {
      newSubMenuDisplay = 'hidden';
    }        // 设置为新的数组
    this.setData({
      subMenuDisplay: newSubMenuDisplay,
      subMenuDisplaytwo: 'hidden'
    });
  }, tapMainMenutwo: function (e) {//        获取当前显示的一级菜单标识
    var newSubMenuDisplay = 'hidden';
    if (this.data.subMenuDisplaytwo == 'hidden') {
      newSubMenuDisplay = 'show';
    } else {
      newSubMenuDisplay = 'hidden';
    }        // 设置为新的数组
    this.setData({
      subMenuDisplaytwo: newSubMenuDisplay,
      subMenuDisplay: 'hidden'
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
  close: function (e){
    var newSubMenuDisplay = 'hidden';
    if (this.data.subMenuDisplay == 'hidden') {
      newSubMenuDisplay = 'show';
    } else {
      newSubMenuDisplay = 'hidden';
    }        // 设置为新的数组
    this.setData({
      subMenuDisplay: newSubMenuDisplay,
      subMenuDisplaytwo: 'hidden'
    });
  }, 
  closetwo: function (e) {
    var newSubMenuDisplay = 'hidden';
    if (this.data.subMenuDisplaytwo == 'hidden') {
      newSubMenuDisplay = 'show';
    } else {
      newSubMenuDisplay = 'hidden';
    }        // 设置为新的数组
    this.setData({
      subMenuDisplaytwo: newSubMenuDisplay,
      subMenuDisplay: 'hidden'
    });
  },
  switchs: function (e) {
    var that = this;
    var id = e.target.id;
    var types = '';
    if ((id.substring(id.indexOf("_") + 1)) != 5){
      that.setData({
        ['routers[' + this.data.typelastclick.substring(this.data.typelastclick.indexOf("_") + 1) + '].sel']: 'false',
        ['routers[' + id.substring(id.indexOf("_") + 1) + '].sel']: 'true'
      })
      that.setData({
        typelastclick: id,
        types: this.data.routers[id.substring(id.indexOf("_") + 1)].types
      })
    }
  },
  shaixuan: function () {
    wx.navigateTo({
      url: ''
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