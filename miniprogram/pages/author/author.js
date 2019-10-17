// pages/author/author.js
const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tags: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideLoading();
    db.collection('tag_in').orderBy('index', 'asc').get().then(res => {
      console.log(res);
      this.setData({
        tags: res.data
      });
    })
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
              app.globalData.auth = true;
              wx.reLaunch({
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
                        app.globalData.auth = true;
                        this.ex_note_add(res.data[0]._id)
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
  ex_note_add: function (id) {
    let data = {
      income: 99999,
      remark: '财源广进（自动生成例子🌰,长按可删除）',
      type: 'income',
      tag: this.data.tags[0]._id,
      author: id,
      create_time: (new Date()).getTime(),
      change_time: (new Date()).getTime(),
    }
    db.collection('note').add({ data }).then(res => {
      wx.showToast({
        title: '注册成功',
        icon: 'none',
      })
      wx.hideLoading();
      wx.reLaunch({
        url: '/pages/index/index',
      });
    })
  }
})