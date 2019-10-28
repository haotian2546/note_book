// pages/add_note_book/add_note_book.js
const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    covers: [
      'cloud://dev-money.6465-dev-money/static/note_book_cover/WechatIMG1316.jpeg',
      'cloud://dev-money.6465-dev-money/static/note_book_cover/WechatIMG1318.jpeg',
      'cloud://dev-money.6465-dev-money/static/note_book_cover/WechatIMG1315.jpeg', 
      'cloud://dev-money.6465-dev-money/static/note_book_cover/WechatIMG1317.jpeg',
    ],
    current_cover: 0,
    title: '',
    des: '一张有趣的账单～',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },



  handel_note_book: function name() {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          if (app.globalData.userInfo) {
            this.add_notebook()
          } else {
            app.checkLoginReadyCallback = res => {
              this.add_notebook()
            };
          }
        } else {
          wx.showModal({
            title: `授权`,
            confirmText: '去授权',
            cancelText: '再看看',
            content: '该功能需要获取您的信息',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/author/author',
                });
              } else if (res.cancel) {
                return;
              }
            }
          })
        }
      }
    });

  },
  add_notebook: function () {
    let data;
    if (this.data.title && this.data.title.length < 15) {
      data = {
        title: this.data.title,
        des: this.data.des,
        publish: false,
        author: app.globalData.userInfo._id,
        create_time: (new Date()).getTime(),
        change_time: (new Date()).getTime(),
      };
      db.collection('list').add({ data }).then(res => {
        wx.redirectTo({
          url: '/pages/list/list?id=' + res._id,
        });
      })
    } else {
      wx.showToast({
        title: '好像有什么问题',
        icon: 'none',
        duration: 1500,
        mask: false,
      });
    }
  },
  handel_title: function (e) {
    this.setData({
      title: e.detail.value
    })
  },
  handel_des: function (e) {
    this.setData({
      des: e.detail.value
    })
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

  },
  previewHandel(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: this.data.covers,
    });
  },
  check_cover_handel(e) {
    this.setData({
      current_cover: e.currentTarget.dataset.index,
    })
  }
})