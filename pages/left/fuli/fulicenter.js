function initSubMenuDisplay() {
  return ['hidden', 'hidden', 'hidden'];
}

var id;
var api = require('../../../config/api.js');
var md5 = require('../../../utils/md5.js');
var sha1 = require('../../../utils/sha1.js');
var util = require('../../../utils/util.js');
var app = getApp();
Page({
  data: {
    activities: [{}],
    imgurl:'',
    username: '',
    oldpwd: '',
    code: '',
    password: '',
    confirmPassword: '',
    subMenuDisplay: initSubMenuDisplay(),
    id: 0,
    color: ''
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    // 页面渲染完成
    var that = this;
    var today = new Date();
    var shajm = sha1.getSHA1(today.getDate() + '' + app.globalData.key_words).toUpperCase();
    console.log(today.getDate())
    console.log(shajm)
    wx.request({
      url: 'https://apiwx.dkwgps.com/userapi/Information/messageCenterWeal',
      data: {
        jm:shajm
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log(res)
        console.log(res.data.datas.length)
        console.log(res.data.datas[0].title)
        for (var i = 0; i < res.data.datas.length; i++){
          that.setData({
            ['activities[' + i + '].title']: res.data.datas[i].title,
            ['activities[' + i + '].content']: res.data.datas[i].content,
            ['activities[' + i + '].time']: '时间:' + res.data.datas[i].starttime + '~' + res.data.datas[i].endtime,
            ['activities[' + i + '].img']: res.data.datas[i].img
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

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  bigimg:function(e){
    var that = this;
    var id = e.target.id;
    console.log(e)
    var imgurl = '';
    for(var i=0;i<this.data.activities.length;i++){
        if('img'+i==id){
          imgurl = this.data.activities[i].img;
        }
    }
    this.setData({
      imgurl: imgurl
    })
    wx.previewImage({
      current: '', // 当前显示图片的http链接
      urls: [imgurl] // 需要预览的图片http链接列表
    })
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