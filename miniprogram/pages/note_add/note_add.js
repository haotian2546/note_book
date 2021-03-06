// pages/add_note/add_note.js
const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tags: [],
    current_tag: 0,
    type: 'tag_out',
    remark: '',
    money: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTags();
  },
  getTags: function () {
    wx.showLoading({
      title: 'loading',
      mask: true,
    });
    db.collection(this.data.type).orderBy('index', 'asc').get().then(res => {
      console.log(res);
      this.setData({
        tags: res.data
      });
      wx.hideLoading();
    })
  },
  switch_tag_handel: function (e) {
    this.setData({
      current_tag: e.target.dataset.index
    })
  },
  switch_type_handel: function (e) {
    this.setData({
      type: e.target.dataset.type
    }, () => {
      this.getTags();
    })
  },

  submit_handel: function () {
    let data;
    if (this.data.type === 'tag_out') {
      data = {
        expend: this.data.money,
        remark: this.data.remark,
        type: 'expend',
        tag: this.data.tags[this.data.current_tag]._id,
        // author: app.globalData.userInfo._id,
        create_time: (new Date()).getTime(),
        change_time: (new Date()).getTime(),
      }
    } else if (this.data.type === 'tag_in') {
      data = {
        income: this.data.money,
        remark: this.data.remark,
        type: 'income',
        tag: this.data.tags[this.data.current_tag]._id,
        // author: app.globalData.userInfo._id,
        create_time: (new Date()).getTime(),
        change_time: (new Date()).getTime(),
      }
    }
    if (!isNaN(this.data.money) && this.data.money > 0) {
      wx.showLoading({
        title: '正在记账...',
        mask: true,
      });
      wx.cloud.callFunction({
        name: 'add_note_v1',
        data: { note: data },
        success: function (res) {
          console.log(res);
          if (res.result._id) {
            wx.reLaunch({
              url: '/pages/index/index',
            });
          } else {
            wx.showToast({
              title: res.result.errMsg,
              icon: 'none',
              image: '',
              duration: 1500,
              mask: false,
            });
          }
        }
      })
    } else {
      wx.showToast({
        title: '有错误',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      });
    }
  },
  remark: function (e) {
    this.setData({
      remark: e.detail.value
    })
  },
  money: function (e) {
    this.setData({
      money: e.detail.value
    })
  },

  onShareAppMessage: function () {

  }
})