// pages/note_books/note_books.js
const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 0,
    nothing: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.getList(true)
    } else {
      app.checkLoginReadyCallback = res => {
        this.getList(true)
      };
    }
  },
  getList: function (type = false) {
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });
    let that = this;
    wx.cloud.callFunction({
      name: 'getLists',
      data: {
        author: app.globalData.userInfo._id,
        page: that.data.page
      },
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
  onReachBottom: function () {
    if (!this.data.nothing) {
      this.getList()
    }
  },

  onPullDownRefresh: function () {
    this.setData({
      page: 0,
      nothing: false
    });
    this.getList(true);
  },

  nav_add_node_book: function () {
    wx.navigateTo({
      url: '/pages/lists_add/lists_add',
    });

  },
})