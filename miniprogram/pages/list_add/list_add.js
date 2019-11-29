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
    let that = this;
    if (this.data.num > 0 && !isNaN(this.data.num) && this.data.id && this.data.title) {
      wx.showLoading({
        title: '正在插入数据',
        mask: true,
      });
      let data = {
        list: this.data.id,
        num: this.data.num,
        title: this.data.title,
        des: this.data.des,
        // author: app.globalData.userInfo._id,
        create_time: (new Date()).getTime(),
        change_time: (new Date()).getTime(),
      }
      wx.cloud.callFunction({
        name: 'add_my_listnote_v1',
        data: { listnote: data },
        success: function (res) {
          wx.hideLoading();
          wx.redirectTo({
            url: '/pages/list/list?id=' + that.data.id,
          });
        }
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
})