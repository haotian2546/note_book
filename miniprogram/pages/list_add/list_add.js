// pages/list_add/list_add.js
const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 0,
    des: '',
    id: '',
  },

  onLoad: function (options) {
    this.setData({
      id: options.id
    })
  },
  handel_add: function () {
    if (this.data.num > 0 && !isNan(this.data.num) && this.data.id && this.data.des) {
      let data = {
        num: this.data.num,
        des: this.data.des,
        author: app.globalData.userInfo._id,
        create_time: (new Date()).getTime(),
        change_time: (new Date()).getTime(),
        list: this.data.id,
      }
      db.collection('list_note').add({ data }).then(res => {
        console.log(res);
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







  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})