const App = getApp();
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    show_back: {
      type: Boolean,
      value: true
    },
    show_home: {
      type: Boolean,
      value: false
    },
    show_addnote: {
      type: Boolean,
      value: false
    },
    show_addlists: {
      type: Boolean,
      value: false
    },
    show_avatar: {
      type: String,
      value: ''
    },
    show_title: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    nav_global: {}
  },
  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () {
    this.setData({
      nav_global: App.globalData.nav_global
    });
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //回退
    _nav_back: function () {
      wx.navigateBack()
    },
    //回主页
    _nav_home: function () {
      wx.navigateTo({
        url: '/pages/home/home'
      });
      wx.switchTab({
        url: '/pages/index/index',
      });
    },
  }
})