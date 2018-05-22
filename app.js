var util = require('./utils/util.js');
var api = require('./config/api.js');
var user = require('./services/user.js');

App({
  onLaunch: function () {
    user.checkLogin().then(res => {
      console.log("一等李")
      this.globalData.hasLogin = true;
      // wx.navigateTo({
      //   url: '/pages/index/index',
      // })
    }).catch(() => {
      console.log("未登录")
      this.globalData.hasLogin = false;
      // wx.navigateTo({
      //   url: '/pages/auth/login/login',
      // })
    });
  },
  onShow: function (options) {
   
  },
  globalData: {
    hasLogin: false,
    key_words:'&wuliangpsDkw_8675.Zz',
    address:''
  }
})