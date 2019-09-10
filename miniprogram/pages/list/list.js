// pages/list/list.js
const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    lists_id: ''
  },

  onLoad: function (options) {
    this.setData({
      lists_id: options.id
    });
    this.getData(options.id)
  },
  getData: function (id) {
    let that = this;
    wx.cloud.callFunction({
      name: 'getLists',
      data: { id: id },
      success: function (res) {
        console.log(res);
        that.setData({
          info: res.result
        })
      }
    })
  },
  nav_list_add: function () {
    wx.navigateTo({
      url: '/pages/list_add/list_add?id=' + this.data.lists_id,
    });
  },
  onPullDownRefresh: function () { },
  onReachBottom: function () { },
})