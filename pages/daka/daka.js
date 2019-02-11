var Bmob = require('../../utils/Bmob-1.6.7.min.js')
// pages/daka/daka.js
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
    let page = this;
    let challenge_id = 'ZIrt444A';
    const query = Bmob.Query('Bookings');
    query.equalTo('challenge_id', '==', challenge_id);
    query.include('challenge_id', 'user_id','challenge_id.user_id');
    query.find().then(res => {
      console.log(res);
      page.setData({
        challenge: res[0].challenge_id,
        bookings: res
      })
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