// pages/activity/arrest_the/arrest_the.js
const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arrest: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getArrest(options.id)
  },
  getArrest: function (id) {
    let that = this;
    wx.cloud.callFunction({
      name: 'active_v1',
      data: {
        action: 'active_get_the_arrest_v1',
        id: id,
      },
      success: function (res) {
        console.log(res.result)
        that.setData({
          arrest: res.result
        })
      }
    })
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