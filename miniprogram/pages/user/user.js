// pages/user/user.js
const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    count: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '恭喜发财',
      mask: true,
    });
    if (app.globalData.userInfo) {
      this.getCount()
    } else {
      app.checkLoginReadyCallback = res => {
        this.getCount()
      };
    }
  },
  getCount: function () {
    let that = this;
    this.setData({
      userInfo: app.globalData.userInfo
    });
    wx.cloud.callFunction({
      name: 'userCount',
      data: {
        author: app.globalData.userInfo._id
      },
      success: function (res) {
        that.setData({
          count: res.result
        }, () => {
          wx.hideLoading();
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // wx.hideLoading();
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