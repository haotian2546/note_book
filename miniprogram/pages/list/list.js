// pages/list/list.js
const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    lists_id: '',
    list: [],
    nothing: false,
    page: 0,
    admin: false,
  },

  onLoad: function (options) {
    this.setData({
      lists_id: options.id
    }, () => {
      this.getDes(options.id);
      this.getListNotes();
    });
  },
  getDes: function (id) {
    let that = this;
    wx.cloud.callFunction({
      name: 'getLists',
      data: { id: id },
      success: function (res) {
        that.setData({
          info: res.result
        });
        if (app.globalData.userInfo && res.result.author._id === app.globalData.userInfo._id) {
          that.setData({
            admin: true
          })
        }
      }
    })
  },
  getListNotes: function (type) {
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });
    let that = this;
    wx.cloud.callFunction({
      name: 'getListNotes',
      data: { id: that.data.lists_id, page: that.data.page },
      success: (res) => {
        if (type) {
          that.setData({
            list: res.result,
            page: that.data.page + 1
          }, () => {
            wx.hideLoading();
            wx.stopPullDownRefresh();
          })
        } else {
          that.setData({
            list: that.data.list.concat(res.result),
            page: that.data.page + 1
          }, () => {
            wx.hideLoading();
            wx.stopPullDownRefresh();
          })
        }
        if (res.result.length === 0) {
          that.setData({
            nothing: true,
          })
        }
      }
    })
  },
  nav_list_add: function () {
    wx.redirectTo({
      url: '/pages/list_add/list_add?id=' + this.data.lists_id,
    });
  },
  onPullDownRefresh: function () {
    this.setData({
      page: 0,
      nothing: false
    });
    this.getDes(this.data.lists_id);
    this.getListNotes(true);
  },
  onReachBottom: function () {
    if (!this.data.nothing) {
      this.getListNotes(false)
    }
  },
  //删除一条记录
  del_note_handel: function (e) {
    if (this.data.admin) {

      wx.showModal({
        title: '警告',
        content: '你确定要删除它吗？',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#999999',
        confirmText: '删除',
        confirmColor: '#52495b',
        success: (result) => {
          if (result.confirm) {
            wx.showLoading({
              title: '正在删除',
              mask: true,
            });
            db.collection('list_note').doc(e.currentTarget.dataset.id).remove({
              success: res => {
                wx.hideLoading();
                if (res.stats.removed) {
                  wx.showToast({
                    icon: 'none',
                    title: '删除成功',
                  })
                  this.setData({
                    page: 0
                  }, () => {
                    this.getListNotes(true);
                  })
                }
              },
              fail: err => {
                wx.hideLoading();
                wx.showToast({
                  icon: 'none',
                  title: '删除失败',
                })
              }
            })
          }
        }
      });
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "有一个账单需要你过目",
      path: '/pages/list/list?id=' + this.data.lists_id, //这里设定都是以"/page"开头,并拼接好传递的参数
      success: function (res) {
        // 转发成功
        console.log("转发成功:");
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:");
      }
    }
  },
})