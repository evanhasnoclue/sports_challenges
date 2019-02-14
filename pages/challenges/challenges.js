var Bmob = require('../../utils/Bmob-1.6.7.min.js')
// pages/challenges/challenges.js
Page({

  /**
   * Page initial data
   */
  data: {

  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    console.log(options)
    let page = this;
    wx.getStorage({
      key: 'userinfo',
      success: function(res) {
        page.setData({
          current_user: res.data
        });
        const query = Bmob.Query('Challenges');
        query.include('user_id','user_id.department_id');
        query.find().then(res => {
          console.log(res);
          page.setData({
            challenges: res
          })
        })
      },
    })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },

  bindshow: function (e) {
    console.log(e);
    wx.redirectTo({
      url: '../show/show?id=' + e.currentTarget.dataset.id,
    })
  }
})