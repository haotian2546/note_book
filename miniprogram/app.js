//app.js
App({
  onLaunch: function (options) {
    let that = this;
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
      wx.showModal({
        title: '系统提示',
        content: '太 Low'
      })
    } else {
      wx.cloud.init({
        // 此处请填入环境 ID, 环境 ID 可打开云控制台查看
        // env: 'dev-money',
        env: 'pro-money',
        traceUser: true,
      });
      wx.cloud.callFunction({
        name: "add_user_v1",
        success: function (res) {
          // console.log('查看是否生成用户信息', res.result);
          if (that.checkLoginReadyCallback) {
            that.checkLoginReadyCallback(res);
          }
        }
      })
    }
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // console.log('onCheckForUpdate====', res)
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          console.log('res.hasUpdate====')
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                // console.log('success====', res)
                // res: {errMsg: "showModal: ok", cancel: false, confirm: true}
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                } else {
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
    if (options.scene == 1007 || options.scene == 1008) {
      this.globalData.nav_global.share = true
    } else {
      this.globalData.nav_global.share = false
    };
    //获取设备顶部窗口的高度（不同设备窗口高度不一样，根据这个来设置自定义导航栏的高度）
    
    let menu = wx.getMenuButtonBoundingClientRect();
    wx.getSystemInfo({
      success: (res) => {
        let statusBarHeight = res.statusBarHeight;
        let navTop = menu.top;
        let navHeight = menu.height + (navTop - statusBarHeight) * 2;

        this.globalData.nav_global.navH = navHeight;
        this.globalData.nav_global.statusBarH = statusBarHeight;

      }
    })
  },
  globalData: {
    userInfo: null,
    auth: false,
    nav_global: {
      share: false,
      navH: '',
      statusBarH: ''
    }
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