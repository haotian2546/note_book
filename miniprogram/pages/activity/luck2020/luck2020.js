// pages/activity/luck2020/luck2020.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lucks: [
      '瘦上10斤',
      '拥有完美身材',
      '人鱼线附体',
      '马甲线附体',
      '一夜暴富',
      '来一场说走就走的旅行',
      '工资翻倍',
      '买到回家的车票',
      '出门就能打上车',
      '冰红茶再来一瓶',
      '集满五福',
      '锦鲤上身',
      '运气爆棚',
      '桃花拉满',
      '千杯不醉',
      '狼人杀活到最后',
      '英雄联盟拿到五杀',
      '把把吃鸡',
      '心想事成',
      '考研成功',
      '逢考必过',
      '顺利毕业',
      '考研成功',
      'offer拿到收手软',
      'ofo退款顺利到账',
      '早上出门就有共享单车',
      '收到一打压岁钱',
      '喜得贵子',
      '家和万事兴',
      '两个月年终奖到账',
      '不再失眠',
      '无忧无虑',
      '落地M4',
      '手机电量100%',
      '手机信号满格',
      '不堵车',
      '遇见最爱的人',
      '抢红包手气最佳',
      '生日收到心仪的礼物',
      '坐地铁有位子',
      '拿到靠窗的机票',
      '事业蒸蒸日上',
      '抖音收获百万赞',
      '抖音吸粉无数',
      '是一个好人',
      '与爱人一起看雪',
      '一家人健健康康',
      '看视频没有广告',
      '无债一身轻',
      '欠我的钱都还给我',
      '马爸爸帮我还花呗',
      '看到美丽的烟花',
      '不用写作业',
      '环球旅行',
      '有一头乌黑茂密的秀发',
      '看直播不卡顿',
      '周杰伦发新专辑',
      '出门见喜'
    ],
    list: [],
    avatar: null,
    nickname: null,
    luck_2020: {},
    img_path: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
        success: function (res) {
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
    for (var i = 0; i < that.data.lucks.length; i++) {
      if (that.data.list.length < 5) {
        that.setData({
          list: [...new Set(that.data.list)],
        });
        var string = that.data.lucks[Math.round(Math.random() * (that.data.lucks.length - 1))];
        that.setData({
          list: that.data.list.concat(string),
        });
      };
    };
    wx.cloud.callFunction({
      name: 'active_luck2020_v1',
      data: {
        luck: that.data.list,
      }
    }).then(res => {
      that.setData({
        luck_2020: res.result,
      });
      wx.downloadFile({
        url: res.result.avatarUrl, //仅为示例，并非真实的资源
        success: function (res) {
          if (res.statusCode === 200) {
            that.setData({
              avatar: res.tempFilePath
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
    var texts = this.data.luck_2020.luck_list;
    var name = this.data.luck_2020.niceName;
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
        console.log(res);
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