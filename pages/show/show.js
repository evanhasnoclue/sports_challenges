var Bmob = require('../../utils/Bmob-1.6.7.min.js')
// pages/show/show.js
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
    const query = Bmob.Query('Challenges');
    query.include('user_id')
    let page = this;
    query.get("ZIrt444A").then(res => {
      page.setData({ clickChallenge: res });
    }).catch(err => {
      console.log(err)
    })
    // const query2 = Bmob.Query("Bookings");
    // query.statTo("where", '{"challenge_id":{"$inQuery":{"where":{"objectId:"6EY0KKKl"},"className":"Challenges"}}}');
    // query2.find().then(res => {
    //   console.log(res)
    // });
    const queryf = Bmob.Query('Bookings')
    queryf.equalTo("challenge_id", "==", "ZIrt444A");
    queryf.include('user_id', 'Users')
    // query.include('user_id')
    queryf.count().then(res => {
      page.setData({actualNum:res})
      console.log(`共有${res}条记录`)
      console.log(page.data)
    });
    queryf.find().then(res => {
      page.setData({participants:res})
    }).catch(err => {
      console.log(err)
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