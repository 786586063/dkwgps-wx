var md5 = require('../utils/md5.js');
var sha1 = require('../utils/sha1.js');

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
/**
 * 封装showmodel
 */
function showmodel(title,content){
  return new Promise(function(resolve,reject){
    wx.showModal({
      title: title,
      content: content,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          resolve(res)
        } else if (res.cancel) {
          console.log('用户点击取消')
          reject(res);
        }
      }
    })
  })
}

/**
 * 封封微信的的request
 */
function request(url, data = {}, method = "GET") {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
        // 'X-Litemall-Token': wx.getStorageSync('token')
      },
      success: function (res) {
        // console.log("成功请求："+JSON.stringify(res))
        if (res.statusCode == 200) {
          console.log("resquest: "+JSON.stringify(res))
          if (res.data.result == 500) {
            // 清除登录相关内容
            try {
              wx.removeStorageSync('userInfo');
              wx.removeStorageSync('token');
            } catch (e) {
              // Do something when catch error
            }
            // 切换到登录页面
            wx.navigateTo({
              url: '/pages/auth/login/login'
            });
          } else {
            resolve(res);
          }
        } else {
          reject(res);
        }

      },
      fail: function (err) {
        reject(err)
      }
    })
  });
}

function redirect(url) {

  //判断页面是否需要登录
  if (false) {
    wx.redirectTo({
      url: '/pages/auth/login/login'
    });
    return false;
  } else {
    wx.redirectTo({
      url: url
    });
  }
}

function showErrorToast(msg) {
  wx.showToast({
    title: msg
    // image: '/static/images/icon_error.png'
  })
}
function showSuccessToast(msg) {
  wx.showToast({
    title: msg
    // image: '/static/images/icon_error.png'
  })
}

function getMd5(str){
  return md5.getMD5(str);
}
function getSHA1(str){
  return sha1.getSHA1(str);
}
function showToast(title){
  wx.showToast({
    title: title,
    icon: 'none',
    duration: 2000
  })
}

module.exports = {
  formatTime: formatTime,
  formatTime,
  request,
  redirect,
  showErrorToast,
  getMd5,
  getSHA1,
  showmodel,
  showSuccessToast,
  showToast
}


