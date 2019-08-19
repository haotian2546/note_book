// pages/add_note_book/add_note_book.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    covers: [
      'cloud://dev-money.6465-dev-money/static/note_book_cover/WechatIMG1316.jpeg',
      'cloud://dev-money.6465-dev-money/static/note_book_cover/WechatIMG1318.jpeg',
      'cloud://dev-money.6465-dev-money/static/note_book_cover/WechatIMG1315.jpeg', 'cloud://dev-money.6465-dev-money/static/note_book_cover/WechatIMG1317.jpeg',
    ],
    current_cover: 0,
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