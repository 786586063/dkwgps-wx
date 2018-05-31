// pages/recharge/recharge.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    select:0,
    count:0,
    amount:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  selectcount:function(e){
    var that = this;
    var select = that.data.select;
    var id = e.currentTarget.dataset.id;
    var amount = that.data.amount;
    console.log(id);
    if(id == 10){
      select =1;
    }else if(id == 50){
      select =2;
    }else if(id == 100){
      select = 3;
    }else{
      select = 4;
    }
    amount = id / 10;
    that.setData({
      select:select,
      count:id,
      amount: amount
    })


  },
  submit:function(){
    var that = this;
    var amount = that.data.amount;
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
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