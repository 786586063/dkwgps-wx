var md5 = require('../utils/md5.js');
var sha1 = require('../utils/sha1.js');
var api = require('../config/api.js');
var app = getApp();
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
        'Content-Type': 'application/json'
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
function toDecimal(x) {
  var f = parseFloat(x);
  if (isNaN(f)) {
    return;
  }
  f = Math.round(x * 100) / 100;
  return f;
} 
function getAddress(lon, lat, success, fail){
  var address = '';
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
        address = res.data.address;
        success(address)
      }
    },
    
    fail: function (res) {
      fail(res);
    }

  });
}
function getCurrentDate(date) {
  var today = new Date()
  var year = today.getFullYear()
  var month = today.getMonth() + 1
  var day = today.getDate()
  var week = today.getDay()

  function getFullDate() {
    return year + '-' + addZero(month) + '-' + addZero(day)
  }

  function getYearMonth() {
    return year + '-' + addZero(month)
  }


  return {
    getFullDate,
    getYearMonth,
  }
}

function getYear() {
  var today = new Date()
  var year = today.getFullYear()
  var month = today.getMonth() + 1
  var day = today.getDate()
  return year
}

function getMonth() {
  var today = new Date()
  var year = today.getFullYear()
  var month = today.getMonth() + 1
  var day = today.getDate()
  return addZero(month)
}

function getDay() {
  var today = new Date()
  var year = today.getFullYear()
  var month = today.getMonth() + 1
  var day = today.getDate()
  return day
}

function getWeek(date) {
  var today = new Date()
  var seldate = new Date(date)
  var week = '今天'

  if (today.getFullYear().toString() == seldate.getFullYear().toString() &&
    today.getMonth().toString() == seldate.getMonth().toString() &&
    today.getDate().toString() == seldate.getDate().toString()) {
    return week
  } else {
    if (seldate.getDay() == 1) {
      var temp = '一'
    } else if (seldate.getDay() == 2) {
      var temp = '二'
    } else if (seldate.getDay() == 3) {
      var temp = '三'
    } else if (seldate.getDay() == 4) {
      var temp = '四'
    } else if (seldate.getDay() == 5) {
      var temp = '五'
    } else if (seldate.getDay() == 6) {
      var temp = '六'
    } else if (seldate.getDay() == 0) {
      var temp = '天'
    }
    week = '星期' + temp
  }
  return week
}

function translateFormateDate(date) {
  var year = date.split('-')[0]
  var month = date.split('-')[1]
  return year + '年' + month + '月'
}

function yearDate(date) {
  var year = date.split('-')[0]
  return year
}

function monthDate(date) {
  var month = date.split('-')[1]
  return month
}


//输入年份，判断是润年还是平年
function is_leap(year) {
  return year % 400 === 0 || year % 4 === 0 && year % 100 !== 0 ? true : false
}

//输入年份，获取这一年每个月的天数
function m_days(year) {
  return [31, 28 + is_leap(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
}

//输入年月，返回这个月的第一天是星期几
//2017-04
function firstDay(date) {
  return new Date(date + '-01').getDay()
}

//输入年月，返回一个数组, 2017-03
function generateDays(date) {
  var today = new Date()
  var year = date.split('-')[0]
  var month = date.split('-')[1] - 1
  var arr = []
  for (let j = 0; j < firstDay(date); j++) {
    arr.push({ value: '', num: '', startsel: 'false', endsel: 'false' })
  }
  for (let i = 0; i < m_days(year)[month]; i++) {
    let value = year + '-' + addZero(month + 1) + '-' + addZero(i + 1)
    console.log(today.getDate().toString())
    var temp = '';
    if (i > 8) {
      temp = i + 1 + ''
    } else {
      temp = '0' + i + 1
    }
    if (temp == today.getDate().toString()) {
      arr.push({
        num: addZero(i + 1),
        value: value,
        startsel: 'true',
        endsel: 'true'
      })
    } else {
      arr.push({
        num: addZero(i + 1),
        value: value,
        startsel: 'false',
        endsel: 'false'
      })
    }
  }

  return arr
}

//接受年月，返回下一个年月
function nextMonth(date) {
  var year = date.split('-')[0]
  var month = date.split('-')[1]
  if (parseInt(month) < 11)
    return year + '-' + addZero(parseInt(month) + 1)
  else
    return parseInt(year) + 1 + '-' + '01'
}

//接受年月，返回前一个年月
function lastMonth(date) {
  var year = date.split('-')[0]
  var month = date.split('-')[1]

  if (month === '01')
    return parseInt(year) - 1 + '-' + '12'
  else
    return year + '-' + addZero(parseInt(month) - 1)
}
function getselDate(date) {
  var seldate = new Date(date)
  var year = seldate.getFullYear()
  var month = seldate.getMonth() + 1
  var day = seldate.getDate()
  var week = seldate.getDay()
  return year + '/' + addZero(month) + '/' + addZero(day)
}
function addZero(num) {
  return num < 10 ? '0' + num : num
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
  showToast,
  toDecimal,
  getAddress,
  getCurrentDate,
  generateDays,
  translateFormateDate,
  nextMonth,
  lastMonth,
  getselDate,
  getYear,
  getMonth,
  getDay,
  getWeek,
  yearDate,
  monthDate
}


