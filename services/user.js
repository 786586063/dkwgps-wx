/**
 * 用户相关服务
 */
const util = require('../utils/util.js');
const api = require('../config/api.js');


/**
 * Promise封装wx.checkSession
 */
function checkSession() {
  return new Promise(function (resolve, reject) {
    wx.checkSession({
      success: function () {
        resolve(true);
      },
      fail: function () {
        reject(false);
      }
    })
  });
}

/**
 * Promise封装wx.login
 */
function login() {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function (res) {
        if (res.code) {
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function (err) {
        reject(err);
      }
    });
  });
}

/**
 * Promise封装wx.getUserInfo
 */
function getUserInfo() {
  return new Promise(function (resolve, reject) {
    wx.getUserInfo({
      withCredentials: true,
      success: function (res) {
        resolve(res);
      },
      fail: function (err) {

        wx.showModal({
          title: '用户未授权',
          content: '请给予您的用户信息授权。',
          success: function (res) {
            if (res.confirm) {
              wx.openSetting({
                success: (res) => {
                  if (res.authSetting["scope.userInfo"] === true) {
                    wx.getUserInfo({
                      withCredentials: true,
                      success: function (res) {
                        resolve(res);
                      },
                    })
                  }
                }
              })
            } else if (res.cancel) {
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
      }
    })
  });
}

/**
 * 调用微信登录
 */
function loginByWeixin() {

  let code = null;
  return new Promise(function (resolve, reject) {
    return login().then((res) => {
      code = res.code;
      return getUserInfo();
    }).then((userInfo) => {
      //登录远程服务器
      var encryptedData = userInfo.encryptedData;
      var iv = userInfo.iv
      // console.log("userInfo"+JSON.stringify(userInfo));
      console.log("code:" + code);
      console.log("data: " + encryptedData);
      console.log("iv: " + iv);
      util.request(api.AuthLoginByWeixin, {
        encryptedData: userInfo.encryptedData,
        iv: userInfo.iv,
        code: code,
      }, 'POST').then(res => {
       // console.log("res: " + res);
        if (res.data.result == 1) {
          //存储用户信息
          wx.setStorageSync('userInfo', res.data.datas);
          // wx.setStorageSync('token', res.data.token);

          resolve(res);
        }else if(res.data.result ==2){
          var openid = res.data.openid;
          wx.showModal({
            title: '提示',
            content: '检查到您还没有在本平台注册，是否跳转至注册页面？',
            success: function (res) {
              if (res.confirm) {
                wx.setStorageSync('openid', openid)
                wx.navigateTo({
                  url: '../register/register?openid='+openid
                })
              } else if (res.cancel) {
                console.log("取消")
              }
            }
          })
          
          // util.showmodel('提示','检查到您还没有在本平台注册，是否跳转至注册页面？').then((res) =>{
          //   // wx.setStorageSync("openid", res.data.openid);
          //   console.log("openid: "+res.data.openid)
          //   wx.navigateTo({
          //     url: '../register/register'
          //   })
          // }).catch((err) =>{
          //   //跳转至首页
          //   // wx.showToast({
          //   //   title: '',
          //   //   duration: 2000
          //   // })
          //   util.showToast('跳转失败，请使用账号密码登录！')
          // })
        } else {
          reject(res);
        }
      }).catch((err) => {
        reject(err);
      });
      // wx.request({
      //   url: api.AuthLoginByWeixin,
      //   data:{
      //     encryptedData: userInfo.encryptedData,
      //     iv: userInfo.iv,
      //     code: code
      //   },
      //   method:'POST',
      //   header:{
      //     'Content-Type': 'application/json'
      //   },
      //   success: function (res) {
      //     console.log("ssdsdsdss:" +JSON.stringify(res))
      //   },
      //   fail: function (err) {
      //     // reject(err)
      //   }


      // })
    }).catch((err) => {
      reject(err);
    })
  });
}

/**
 * 判断用户是否登录
 */
function checkLogin() {
  return new Promise(function (resolve, reject) {
    console.log(wx.getStorageSync('userInfo'));
    if (wx.getStorageSync('userInfo') != null && wx.getStorageSync('userInfo')!='') {
      // console.log('opend : '+ wx.getStorageSync('openid'));
      resolve(true);
      // // if(wx.getStorageSync('openid')!=null){
      //   checkSession().then(() => {
      //     resolve(true);
      //   }).catch(() => {
      //     reject(false);
      //   });
      // }else{
      //   resolve(true);
      // }
      
    } else {
      reject(false);
    }
  });
}


module.exports = {
  loginByWeixin,
  checkLogin,
};











