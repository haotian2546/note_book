// pages/index/index.js
const moment = require('../../utils/moment.js');
const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 0,
    nothing: false,
    startDate: 0,
    endDate: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.getList(true)
    } else {
      app.checkLoginReadyCallback = res => {
        // this.setData({
        //   startDate: moment().month(moment().month()).startOf('month').valueOf(),
        //   endDate: moment().month(moment().month()).endOf('month').valueOf(),
        //   year: new Date().getFullYear(),
        //   month: new Date().getMonth() + 1,
        // }, () => {
        //   this.getList()
        // })
        this.getList(true)
      };
    }

  },


  getList: function (type = false) {
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });
    let that = this;
    wx.cloud.callFunction({
      name: 'getNotes',
      data: {
        author: app.globalData.userInfo._id,
        page: that.data.page
      },
      success: function (res) {
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
        };
        if (res.result.length === 0) {
          that.setData({
            nothing: true,
          })
        }
      }
    })
  },
  //跳转记账页面
  nav_add_note: function () {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          if (app.globalData.userInfo) {
            wx.navigateTo({
              url: '/pages/note_add/note_add',
            });
          } else {
            app.checkLoginReadyCallback = res => {
              wx.navigateTo({
                url: '/pages/note_add/note_add',
              });
            };
          }
        } else {
          wx.showModal({
            title: `授权`,
            confirmText: '去授权',
            cancelText: '再看看',
            content: '授权解锁更多功能',
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
  //跳转详情页面
  nav_note_handel: function (e) {
    if (this.endTime - this.startTime < 350) {
      wx.navigateTo({
        url: '/pages/note/note?id=' + e.currentTarget.dataset.id,
      });
    }

  },
  onPullDownRefresh: function () {
    this.setData({
      page: 0,
      nothing: false
    });
    this.getList(true);
  },
  //删除一条记录
  del_note_handel: function (e) {
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
          db.collection('note').doc(e.currentTarget.dataset.id).remove({
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
                  this.getList(true);
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

  },
  //touch start
  handleTouchStart: function (e) {
    this.startTime = e.timeStamp;
    //console.log(" startTime = " + e.timeStamp);  
  },

  //touch end
  handleTouchEnd: function (e) {
    this.endTime = e.timeStamp;
    //console.log(" endTime = " + e.timeStamp);  
  },
  //上拉加载
  onReachBottom: function () {
    if (!this.data.nothing) {
      this.getList()
    }
  },
})