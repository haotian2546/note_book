// pages/calendar/calendar.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    days_style: ['#52495b','#ffffff']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  dayClick: function (event) {
    console.log(event.detail);
    let year = event.detail.year;
    let month = event.detail.month;
    let day = event.detail.day;
    let days_style = this.data.days_style;
    days_style.pop();
    days_style.push({
      month: 'current',
      day: day,
      color: 'white',
      background: '#52495b',
      bottomText: '已签到',
      fontSize: '40rpx'
    });
    this.setData({
      days_style
    });
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