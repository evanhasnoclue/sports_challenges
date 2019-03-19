var Bmob = require('../../utils/Bmob-1.6.7.min.js')
var util = require('../../utils/util.js')
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
    let page = this;
    var TIME = util.formatTime(new Date());
    this.setData({
      time: TIME,
    });
    wx.getStorage({
      key: 'userinfo',
      success: function(res) {
        let user_id = res.data.objectId
        console.log(res.data)

    const query_user = Bmob.Query('Users');
    query_user.get(user_id).then(res => {
      page.setData({
        current_user: res
      });
    })
    const query_daka = Bmob.Query('Challenges');
    query_daka.include('user_id', 'user_id.department_id');
    query_daka.equalTo('status', '==', '已打卡');
    query_daka.equalTo('name', '!=', '');
    query_daka.order("-updatedAt");
    query_daka.limit(5);
    query_daka.find().then(res => {
      console.log(res);
      page.setData({
        daka_challenges: res
      })
    })
    const query = Bmob.Query('Challenges');
    query.include('user_id','user_id.department_id');
    query.equalTo('status','!=','已打卡');
    query.equalTo('start_time','>=',TIME);
    query.order("start_time")
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
    this.onLoad()
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
  },
  bindNew: function (e) {
    wx.navigateTo({
      url: '../create/create',
    })
  }
})