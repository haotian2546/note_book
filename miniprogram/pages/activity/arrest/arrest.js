// pages/activity/arrest/arrest.js
const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    number: '',
    description: '',
    repeat: false,
    view_only_me: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },



  handel_title: function (e) {
    this.setData({
      title: e.detail.value
    })
  },
  handel_number: function (e) {
    this.setData({
      number: e.detail.value
    })
  },
  handel_description: function (e) {
    this.setData({
      description: e.detail.value
    })
  },
  handel_repeat: function (e) {
    this.setData({
      repeat: e.detail.value
    })
  },
  handel_view: function (e) {
    this.setData({
      view_only_me: e.detail.value
    })
  },
  handel_submit: function () {
    if (!this.data.title || !/^[1-9]\d*$/.test(this.data.number)) {
      wx.showToast({
        title: '好像有什么问题',
        icon: 'none',
        mask: false,
      });
    } else {
      let data = {
        title: this.data.title,
        number: this.data.number,
        description: this.data.description,
        repeat: this.data.repeat,
        view_only_me: this.data.view_only_me,
      };
      wx.cloud.callFunction({
        name: 'active_v1',
        data: {
          action: 'active_arrest_add_v1',
          arrest: data,
        }
      })
    }
  },
  author_userinfo: function (res) {
    wx.showLoading({
      title: 'loading',
      icon: 'none',
      mask: true,
    });
    let that = this;
    if (res.detail.errMsg === 'getUserInfo:ok') {
      wx.cloud.callFunction({
        name: 'up_user_v1',
        data: {
          updata: {
            avatarUrl: res.detail.userInfo.avatarUrl,
            nickName: res.detail.userInfo.nickName,
            gender: res.detail.userInfo.gender,
            change_time: (new Date()).getTime(),
          }
        },
        success: function () {
          that.handel_submit();
        }
      })
    } else {
      wx.showToast({
        title: '授权失败',
        icon: 'none',
      })
    }

  },






})