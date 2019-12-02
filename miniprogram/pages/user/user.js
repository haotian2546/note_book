// pages/user/user.js
const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: { avatarUrl: '123' },
    count: { expend: 0, income: 0 },
    auth: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCount()
    app.checkLoginReadyCallback = res => {
      this.setData({
        userInfo: {},
        count: {},
      }, () => {
        this.getCount()
      })
    };
  },
  getCount: function () {
    wx.showLoading({
      title: 'loading...',
      mask: true,
    });
    let that = this;
    wx.cloud.callFunction({
      name: 'get_my_v1',
      success: function (res) {
        console.log(res);
        that.setData({
          count: res.result,
          userInfo: res.result.user,
        }, () => {
          wx.hideLoading();
          wx.stopPullDownRefresh();
        })
      },
      error: function (err) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    })
  },
  author_userinfo: function (res) {
    wx.showLoading({
      title: 'loading...',
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
        success: function (res) {
          that.getCount()

        }
      })
    } else {
      wx.showToast({
        title: '授权失败',
        icon: 'none',
      })
    }

  },
  onPullDownRefresh: function () {
    this.onLoad()
  },

})