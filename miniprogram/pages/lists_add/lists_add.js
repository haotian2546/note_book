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
    let data;
    if (this.data.title && this.data.title.length < 15) {
      data = {
        title: this.data.title,
        des: this.data.des,
        publish: false,
        // author: app.globalData.userInfo._id,
        create_time: (new Date()).getTime(),
        change_time: (new Date()).getTime(),
      };
      wx.cloud.callFunction({
        name: 'add_list_v1',
        data: { list: data },
        success: function (res) {
          console.log(res);
          wx.redirectTo({
            url: '/pages/list/list?id=' + res.result._id,
          });
        }
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