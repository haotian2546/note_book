// pages/share/share.js
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
    this.qrcode(options.id);
  },
  saveImage: function () {
    wx.getSetting({
      success(res) {
        // 如果没有则获取授权
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {

            },
            fail() {
              // 如果用户拒绝过或没有授权，则再次打开授权窗口
              wx.showToast({
                title: '请设置允许访问相册',
                icon: 'none'
              })
            }
          })
        }else{
          wx.showToast({
            title: 'success',
            icon: 'none'
          })
        }
      }
    })
  },
  qrcode: function (id) {
    let that = this;
    wx.cloud.callFunction({
      name: "qrcode",
      data: {
        path: '/pages/list/list?id=' + id
      },
      success: function (res) {
        console.log(111,res);
        that.drawCvs("data:image/png;base64," + wx.arrayBufferToBase64(res.result.buffer))
      }
    })
  },
  drawCvs: function (qrUrl) {
    let that = this;
    const ctx = wx.createCanvasContext('myCanvas');
    ctx.drawImage('../../images/share.png', 0, 0, 10000, 10000);
    ctx.drawImage(qrUrl, 200, 300, 100, 100);
    ctx.draw();
  }
})