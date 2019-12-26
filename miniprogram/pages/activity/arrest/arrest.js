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
    // -------------------
    arrest_list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_arrests()
  },
  get_arrests: function () {
    let that = this;
    wx.cloud.callFunction({
      name: 'active_v1',
      data: {
        action: 'active_get_arrests_v1',
      },
      success: function (res) {
        that.setData({
          arrest_list: res.result.data
        })
      }
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
        array: [],
        view_only_me: this.data.view_only_me,
        create_time: (new Date()).getTime(),
        change_time: (new Date()).getTime(),
      };
      wx.cloud.callFunction({
        name: 'active_v1',
        data: {
          action: 'active_arrest_add_v1',
          arrest: data,
        },
        success: function (res) {
          wx.hideLoading();
          wx.navigateTo({
            url: '/pages/activity/arrest_the/arrest_the?id=' + res.result._id,
          });
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


})