var Bmob = require('../../utils/Bmob-1.6.7.min.js')
// pages/profile/profile.js
Page({

  /**
   * Page initial data
   */
  data: {
    is_login: true,
    tabs: ["Joined", "Hosted", "Dashboard",],
    activeIndex: 1,
    sliderOffset: 0,
    sliderLeft: 0,
  },

  /**
   * Lifecycle function--Called when page load
   */
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  onLoad: function (options) {
    let page = this;
    wx.getStorage({
      key: 'userinfo',
      success: function(res) {
        console.log(res);
        const query_user = Bmob.Query('Users');
        query_user.include('department_id');
        query_user.get(res.data.objectId).then(res => {
          page.setData({
            userinfo: res
          })
        });
        const query_join = Bmob.Query('Bookings');
        query_join.include('challenge_id','challenge_id.user_id');
        query_join.equalTo('user_id','==',res.data.objectId);
        query_join.find().then(res => {
          console.log('bookings',res);
          page.setData({
            bookings: res
          })
        });
        const query_created = Bmob.Query('Challenges');
        query_created.equalTo('user_id', '==',res.data.objectId);
        query_created.find().then(res => {
          console.log('created',res);
          page.setData({
            created: res
          })
        })
      },
      fail(res) {
        page.setData({
          is_login: false
        })
        wx.redirectTo({
          url: '../login/login',
        })
      }
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

  }
})