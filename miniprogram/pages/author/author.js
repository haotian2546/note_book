// pages/author/author.js
const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideLoading();
  },
  onGotUserInfo: function (res) {
    if (res.detail.errMsg === 'getUserInfo:ok') {
      wx.showLoading({
        title: '正在写入数据',
        mask: true,
        icon: 'loading'
      });
      wx.cloud.callFunction({
        name: "login",
        success: res => {
          db.collection('user').where({
            _openid: res.result.openid
          }).get().then(res => {
            if (res.data.length > 0) {
              //用户已存在，跳转个人中心
              wx.hideLoading();
              wx.showToast({
                title: '已注册',
                icon: 'none',
              });
              app.globalData.userInfo = res.data[0];
              wx.switchTab({
                url: '/pages/index/index',
              });
            } else {
              //用户未注册，需注册
              wx.getUserInfo({
                success: res => {
                  db.collection('user').add({
                    data: {
                      avatarUrl: res.userInfo.avatarUrl,
                      nickName: res.userInfo.nickName,
                      gender: res.userInfo.gender,
                      admin: 0,
                      create_time: (new Date()).getTime(),
                      change_time: (new Date()).getTime(),
                    }
                  }).then(res => {
                    if (res._id) {
                      db.collection('user').where({
                        _id: res._id
                      }).get().then(res => {
                        app.globalData.userInfo = res.data[0];
                        wx.showToast({
                          title: '注册成功',
                          icon: 'none',
                        })
                        wx.hideLoading();
                        wx.switchTab({
                          url: '/pages/index/index',
                        });
                          
                      })

                    } else {
                      wx.showToast({
                        title: '注册失败',
                        icon: 'none',
                      })
                    }
                  })
                }
              })
            }
          })
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