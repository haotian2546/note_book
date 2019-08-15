// pages/index/index.js
const moment = require('../../utils/moment.js');
const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    num_out: 0,
    num_in: 0,
    startDate: 0,
    endDate: 0,
    year: 0,
    month: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(11111, app.globalData.userInfo)
    wx.showLoading({
      title: '正在计算...',
      mask: true,
    });
    if (app.globalData.userInfo) {
      this.setData({
        startDate: moment().month(moment().month()).startOf('month').valueOf(),
        endDate: moment().month(moment().month()).endOf('month').valueOf(),
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
      }, () => {
        this.getList(this.data.startDate, this.data.endDate);
      })
    } else {
      app.checkLoginReadyCallback = res => {
        this.setData({
          startDate: moment().month(moment().month()).startOf('month').valueOf(),
          endDate: moment().month(moment().month()).endOf('month').valueOf(),
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
        }, () => {
          this.getList(this.data.startDate, this.data.endDate);
        })
      };
    }

  },
  nav_add_note: function () {
    wx.navigateTo({
      url: '/pages/add_note/add_note',
    });
  },

  getList: function (start_time, end_time) {
    let that = this;
    wx.cloud.callFunction({
      name: 'getNotes',
      data: {
        start_time,
        end_time,
        author: app.globalData.userInfo._id
      },
      success: function (res) {
        if (res.result.length > 0) {
          that.setData({
            list: res.result
          }, () => {
            that.count_num()
          })
        } else {
          wx.hideLoading();
          wx.stopPullDownRefresh();
          wx.showToast({
            title: '还没有流水',
            icon: 'none',
            image: '',
            duration: 2500,
          });
          that.setData({
            list: [],
            num_out: 0,
            num_in: 0,
          })
        }
      }
    })
  },
  count_num: function () {
    let num_out = 0;
    let num_in = 0;
    for (let i = 0; i < this.data.list.length; i++) {
      if (this.data.list[i].type === "expend") {
        num_out = num_out * 1 + this.data.list[i].expend * 1
      } else if (this.data.list[i].type === "income") {
        num_in = num_in * 1 + this.data.list[i].income * 1
      }
    }
    this.setData({
      num_out: num_out,
      num_in: num_in
    }, () => {
      wx.hideLoading();
      wx.stopPullDownRefresh();
    })
  },
  switch_handel: function (e) {
    let sstime = new Date(e.detail.value.replace(/-/g, '/'));
    let year = sstime.getFullYear();
    let month = sstime.getMonth();
    this.setData({
      startDate: moment().year(year).month(month).startOf('month').valueOf(),
      endDate: moment().year(year).month(month).endOf('month').valueOf(),
      year: year,
      month: month + 1,
    }, () => {
      this.getList(this.data.startDate, this.data.endDate);
    })
  },
  nav_note_handel: function (e) {
    wx.navigateTo({
      url: '/pages/note/note?id=' + e.currentTarget.dataset.id,
    });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getList(this.data.startDate, this.data.endDate);
  },



  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})