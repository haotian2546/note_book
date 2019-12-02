// pages/set/set.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
          wx.showToast({
            title: '重制成功',
            icon: 'none',
            image: '',
            duration: 1500,
            mask: false,
          });
          wx.reLaunch({
            url: '/pages/user/user',
          });
        }
      })
    } else {
      wx.showToast({
        title: '授权失败',
        icon: 'none',
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})