// pages/list_add/list_add.js
const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    num: 0,
    title: '',
    des: '',
  },

  onLoad: function (options) {
    this.setData({
      id: options.id
    })
  },
  handel_add: function () {
    if (this.data.num > 0 && !isNaN(this.data.num) && this.data.id && this.data.title) {
      let data = {
        list: this.data.id,
        num: this.data.num,
        title: this.data.title,
        des: this.data.des,
        author: app.globalData.userInfo._id,
        create_time: (new Date()).getTime(),
        change_time: (new Date()).getTime(),
      }
      db.collection('list_note').add({ data }).then(res => {
        wx.redirectTo({
          url: '/pages/list/list?id=' + this.data.id,
        });

      })
    } else {
      wx.showToast({
        title: '好像有点问题！！！',
        icon: 'none',
        duration: 1500,
      });
    }

  },
  handel_num: function (e) {
    this.setData({
      num: e.detail.value
    })
  },
  handel_des: function (e) {
    this.setData({
      des: e.detail.value
    })
  },
  handel_title: function (e) {
    this.setData({
      title: e.detail.value
    })
  },






  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})