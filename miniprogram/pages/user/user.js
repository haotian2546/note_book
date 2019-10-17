// pages/user/user.js
const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    count: {},
    auth: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          if (app.globalData.userInfo) {
            this.setData({
              auth: true,
            })
            this.getCount()
          } else {
            let that=this;
            wx.cloud.callFunction({
              name: 'login',
              success: res => {
                db.collection('user').where({
                  _openid: res.result.openid
                }).get().then(res => {
                  if (res.data.length > 0) {
                    that.globalData.userInfo = res.data[0];
                    that.getCount()
                  } else {
                    that.setData({
                      auth: false,
                    })
                  }
                })
              }
            })
          }
        } else {
          this.setData({
            auth: false,
          })
        }
      }
    });
  },
  getCount: function () {
    wx.showLoading({
      title: '疯狂计算ing',
      mask: true,
    });
    let that = this;
    this.setData({
      userInfo: app.globalData.userInfo
    });
    wx.cloud.callFunction({
      name: 'userCount',
      data: {
        author: app.globalData.userInfo._id
      },
      success: function (res) {
        that.setData({
          count: res.result
        }, () => {
          wx.hideLoading();
          wx.stopPullDownRefresh();
        })
      },
      error:function (err) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // wx.hideLoading();
  },
  nav_to_auth: function () {
    wx.navigateTo({
      url: '/pages/author/author',
    });
  },
  onPullDownRefresh: function () {
    this.onLoad()
  },

})