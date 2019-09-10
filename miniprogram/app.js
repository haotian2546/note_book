//app.js
App({
  onLaunch: function () {
    let that = this;
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // 此处请填入环境 ID, 环境 ID 可打开云控制台查看
        env: 'dev-money',
        // env: 'pro-money',
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
          that.globalData.auth = true;
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
                if (res.data.length > 0) {
                  that.globalData.userInfo = res.data[0];
                  if (this.checkLoginReadyCallback) {
                    this.checkLoginReadyCallback(res.data[0]);
                  }
                } else {
                  wx.redirectTo({
                    url: '/pages/author/author',
                  });
                }
                wx.hideLoading();
              })
            }
          })
        } else {
          // wx.showToast({
          //   title: '您的账号未授权',
          //   icon: 'none',
          //   duration: 2000,
          //   success: () => {
          //     wx.redirectTo({
          //       url: '/pages/author/author',
          //     });
          //   }
          // });
        }
      }
    });
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        console.log('onCheckForUpdate====', res)
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          console.log('res.hasUpdate====')
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                console.log('success====', res)
                // res: {errMsg: "showModal: ok", cancel: false, confirm: true}
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    auth: false,
  }
})








// wx.showModal({
//   title: `授权`,
//   confirmText: '去授权',
//   cancelText: '回主页',
//   content: '授权解锁更多功能',
//   success: function (res) {
//     if (res.confirm) {
//       wx.navigateTo({
//         url: '/pages/author/author',
//       });
//     } else if (res.cancel) {
//       return;
//     }
//   }
// })