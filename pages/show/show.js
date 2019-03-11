var Bmob = require('../../utils/Bmob-1.6.7.min.js')
// pages/show/show.js
Page({

  /**
   * Page initial data
   */
  data: {
    is_booked: false,
    is_owner:false
  },

  /**
   * Lifecycle function--Called when page load
   */


  onLoad: function (options) {
    console.log(options)
    const query = Bmob.Query('Challenges');
    query.include('user_id')
    let page = this;
    query.get(options.id).then(res => {
      page.setData({ clickChallenge: res });
      wx.getStorage({
        key: 'userinfo',
        success: function(user) {
          if(res.user_id.objectId==user.data.objectId){
            page.setData({is_owner:true})
          }
        },
        fail: function() {
          wx.navigateTo({
            url: '../index/index',
          })
        }
      })
    }).catch(err => {
      console.log(err)
    })
    // const query2 = Bmob.Query("Bookings");
    // query.statTo("where", '{"challenge_id":{"$inQuery":{"where":{"objectId:"6EY0KKKl"},"className":"Challenges"}}}');
    // query2.find().then(res => {
    //   console.log(res)
    // });
    const queryf = Bmob.Query('Bookings')
    queryf.equalTo("challenge_id", "==", options.id);
    queryf.include('user_id', 'Users')
    // query.include('user_id')
    queryf.count().then(res => {
      page.setData({actualNum:res})
      console.log(`共有${res}条记录`)
      console.log(page.data)
    });
    queryf.find().then(res => {
      page.setData({participants:res})
      wx.getStorage({
        key: 'userinfo',
        success: function(user) {
          res.forEach(booking => {
            if(booking.user_id.objectId==user.data.objectId){
              page.setData({
                is_booked: true,
                booking_id: booking.objectId
                })
            }
          })
        },
      })

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
  onShareAppMessage: function (res) {
    console.log('share');
    wx.showShareMenu({
      withShareTicket: true
    })
  },

  refreshBookings: function (challenge_id) {
    let page = this;
    const queryRefresh = Bmob.Query('Bookings')
    queryRefresh.equalTo("challenge_id", "==", challenge_id);
    queryRefresh.include('user_id', 'Users')
    // query.include('user_id')
    queryRefresh.count().then(res => {
      page.setData({ actualNum: res })
      console.log(`共有${res}条记录`)
      console.log(page.data)
    });
    queryRefresh.find().then(res => {
      page.setData({ participants: res })
      wx.getStorage({
        key: 'userinfo',
        success: function (user) {
          res.forEach(booking => {
            if (booking.user_id.objectId == user.data.objectId) {
              page.setData({
                is_booked: true,
                booking_id: booking.objectId
              })
            }
          })
        },
      })

    }).catch(err => {
      console.log(err)
    })
  },

  bindHome: function () {
    wx.switchTab({
      url: '../challenges/challenges',
    })
  },

  bookSports: function (e) {
    console.log(e)
    let page = this;
    wx.getStorage({
      key: 'userinfo',
      success: function(res) {
        let user_id = res.data.objectId
        const pointer_user = Bmob.Pointer('Users')
        const poiUser = pointer_user.set(user_id)
        const pointer_challenge = Bmob.Pointer('Challenges')
        const poiChallenge = pointer_challenge.set(page.data.clickChallenge.objectId)
        const query_booking = Bmob.Query('Bookings')
        query_booking.set('user_id',poiUser);
        query_booking.set('challenge_id',poiChallenge);
        query_booking.save().then(res => {
          console.log(res)
          page.setData({
            is_booked: true
          })
          page.refreshBookings(page.data.clickChallenge.objectId)
        }).catch(err => {
          console.log(err)
        })
      },
      fail: function(res) {
        console.log(e.detail.userInfo)
      }
    })
  },

  cancelBooking: function () {
    let page = this;
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        let user_id = res.data.objectId
        const query_cancel = Bmob.Query('Bookings')
        query_cancel.destroy(page.data.booking_id).then(res => {
          console.log(res)
          page.setData({
            is_booked: false
          })
          page.refreshBookings(page.data.clickChallenge.objectId)
        }).catch(err => {
          console.log(err)
        })
      },
      fail: function (res) {

      }
    })
  },
  deleteSports: function () {
    const query_delete = Bmob.Query("Challenges")
    query_delete.destroy(this.data.clickChallenge.objectId).then(res => {
      wx.redirectTo({
        url: '../challenges/challenges',
      })
    }).catch(err => {
      console.log(err)
    })
  }
})