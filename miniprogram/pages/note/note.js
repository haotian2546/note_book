// pages/note/note.js
const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    note: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: 'loading',
      mask: true,
    });
    this.getData(options.id);
  },
  getData: function (id) {
    db.collection('note').where({ _id: id }).get().then(res => {
      this.setData({
        note: res.data[0]
      }, () => {
        this.getTag(res.data[0].tag, res.data[0].type)
      })
    })
  },
  getTag: function (id, type) {
    db.collection(type === "income" ? 'tag_in' : 'tag_out').where({ _id: id }).get().then(res => {
      let note = this.data.note;
      note.tag = res.data[0];
      this.setData({
        note: note
      },()=>{
        wx.hideLoading();
      });
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

  }
})