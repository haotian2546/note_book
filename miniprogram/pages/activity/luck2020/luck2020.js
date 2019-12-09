// pages/activity/luck2020/luck2020.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    avatar: null,
    nickname: null,
    luck_2020: {},
    img_path: null
  },


  author_userinfo: function (res) {
    wx.showLoading({
      title: '绘制海报',
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
        success: function () {
          that.add_luck2020();
        }
      })
    } else {
      wx.showToast({
        title: '授权失败',
        icon: 'none',
      })
    }

  },
  add_luck2020: function () {
    var that = this;

    wx.cloud.callFunction({
      name: 'active_v1',
      data: {
        action: 'active_luck2020'
      }
    }).then(res => {
      that.setData({
        luck_2020: res.result,
      });
      wx.downloadFile({
        url: res.result.user.avatarUrl, //仅为示例，并非真实的资源
        success: function (re) {
          if (re.statusCode === 200) {
            that.setData({
              avatar: re.tempFilePath
            });
            that.creat_canvas();
          }
        }
      })
    })
  },
  creat_canvas: function () {
    var bg = '/images/activity/luck2020_bg.jpg';
    var avatar = this.data.avatar;
    var texts = this.data.luck_2020.text_list;
    var name = this.data.luck_2020.user.nickName;
    var ctx = wx.createCanvasContext('myCanvas');
    //背景图
    ctx.drawImage(bg, 0, 0, 900, 1400);

    //用户名
    ctx.setFontSize(40);
    ctx.setFillStyle('#000000');
    ctx.fillText(name, 300, 338);
    ctx.setFillStyle('#3c35d0');
    ctx.fillText(texts[0], 280, 570);
    ctx.fillText(texts[1], 280, 660);
    ctx.fillText(texts[2], 280, 750);
    ctx.fillText(texts[3], 280, 835);
    ctx.fillText(texts[4], 280, 925);
    //头像
    ctx.arc(216, 356, 50, 0, 2 * Math.PI) //画出圆
    ctx.strokeStyle = "#ffe200";
    ctx.clip(); //裁剪上面的圆形
    ctx.drawImage(avatar, 166, 306, 100, 100); // 在刚刚裁剪的园上画图
    // ctx.stroke();
    ctx.draw();
    this.creat_img();
  },
  creat_img: function () {
    let that = this;
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas',
      success: (res) => {
        that.setData({
          img_path: res.tempFilePath
        });
        wx.hideLoading();
      }
    })
  },
  save_img: function () {
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.img_path,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
        })
      },
      fail(res) {
        //'saveImageToPhotosAlbum:fail auth deny'
        wx.showModal({
          title: '相册授权失败',
          content: '',
          showCancel: true,
          cancelText: '取消',
          cancelColor: '#999999',
          confirmText: '看看别的',
          confirmColor: '#333',
          success: (result) => {
            if (result.confirm) {
              wx.switchTab({
                url: '/pages/index/index',
              });
            }
          },
        });
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: "我的2020",
      path: '/pages/activity/luck2020/luck2020',
      success: function (res) {
        // 转发成功
        console.log("转发成功:");
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败");
      }
    }
  },
})