//app.js
App({
  onLaunch: function () {
    let that = this;
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // 此处请填入环境 ID, 环境 ID 可打开云控制台查看
        // env: 'dev-money',
        env: 'pro-money',
        traceUser: true,
      })
    }

    const db = wx.cloud.database();
    // this.globalData = {
    //   userInfo: {},
    // };
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          console.log(1)
          wx.showLoading({
            title: '正在加载数据',
            mask: true,
            icon: 'loading'
          });
          wx.cloud.callFunction({
            name: 'login',
            success: res => {
              db.collection('user').where({
                _openid: res.result.openid
              }).get().then(res => {
                console.log(111, res);
                if (res.data.length > 0) {
                  that.globalData.userInfo = res.data[0];
                  if (this.checkLoginReadyCallback) {
                    this.checkLoginReadyCallback(res.data[0]);
                  }
                } else {
                  wx.navigateTo({
                    url: '/pages/author/author',
                  });
                }
                wx.hideLoading();
              })
            }
          })
        } else {
          wx.showToast({
            title: '您的账号未授权',
            icon: 'none',
            duration: 2000,
            success: () => {
              wx.navigateTo({
                url: '/pages/author/author',
              });
            }
          });
        }
      }
    });
  },
  globalData: {
    userInfo: null,
  }
})
