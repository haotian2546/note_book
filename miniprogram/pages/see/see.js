// pages/see/see.js
const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 0,
    nothing: false,
    user_id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList(true);
    this.setData({
      user_id: app.globalData.userInfo._id
    })
  },
  getList: function (type = false) {
    if (type) {
      wx.showLoading({
        title: '加载中...',
        mask: true,
      });
    };
    let that = this;
    wx.cloud.callFunction({
      name: 'getSees',
      data: { page: that.data.page },
      success: function (res) {
        if (res.result.length > 0) {
          if (type) {
            that.setData({
              list: res.result,
              page: that.data.page + 1
            }, () => {
              wx.hideLoading();
              wx.stopPullDownRefresh();
            })
          } else {
            that.setData({
              list: that.data.list.concat(res.result),
              page: that.data.page + 1
            }, () => {
              wx.hideLoading();
              wx.stopPullDownRefresh();
            })
          }

        } else {
          that.setData({
            nothing: true,
          })
          wx.hideLoading();
          wx.stopPullDownRefresh();
        }
      }
    })
  },








  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      page: 0,
      nothing: false
    });
    this.getList(true);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.nothing) {
      this.getList()
    }
  },
})