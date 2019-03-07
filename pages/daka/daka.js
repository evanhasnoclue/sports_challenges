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
  gotoShow: function () {
    var _this = this
    wx.chooseImage({
      count: 9, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        // success
        console.log(res)
        _this.setData({
          photo: res.tempFilePaths
        })

        console.log(_this.data.photo[0])
        var tempFilePaths = res.tempFilePaths
        var file;
        for (let item of tempFilePaths) {
          console.log('itemn', item)
          file = Bmob.File('abc.jpg', item);
        }
        file.save().then(res => {
          console.log(res.length);
          console.log(res);
          _this.setData({
            photoChoose: res
          })
          console.log(_this.data)
          // const file = res
          // const query = Bmob.Query('Challenges');
          // query.set('id', '91f596b27f')
          // query.set('photo', res[0].url)
          // query.save().then(res => {
          //   console.log(res)
          // })
        })

      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })

  },
  bindUpload:function(){

  },


  onLoad: function (options) {
    let page = this;
    let challenge_id = options.id;
    console.log(challenge_id)
    const query = Bmob.Query('Bookings');
    query.equalTo('challenge_id', '==', challenge_id);
    query.include('challenge_id', 'user_id','challenge_id.user_id');
    query.find().then(res => {
      console.log(res);
      page.setData({
        challenge: res[0].challenge_id,
        bookings: res
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
  onShareAppMessage: function () {

  },

  checkboxChange: function(e) {
  },

  bindcheck: function(e) {
    const query = Bmob.Query('Challenges');
    query.get(this.data.challenge.objectId).then(res => {
      console.log(res)
      res.set('daka_photo', this.data.photoChoose[0].url)
      res.save()
    }).catch(err => {
      console.log(err)
    })
    console.log(e.detail.value)
    let page = this;
    const pointer_challenge = Bmob.Pointer('Challenges');
    const poiChallenge = pointer_challenge.set(this.data.challenge.objectId)
    if(e.detail.value.checklist.length >= 4) {
      e.detail.value.checklist.forEach(booking => {
        let query_score = Bmob.Query('Scores');
        let ids = booking.split(',');
        console.log(ids)
        let pointer_booking = Bmob.Pointer('Bookings')
        let poiBooking = pointer_booking.set(ids[0])
        let pointer_user = Bmob.Pointer('Users')
        let poiUser = pointer_user.set(ids[1])
        query_score.set("user_id",poiUser);
        if(ids[0]==page.data.challenge.objectId){
          console.log('orgnizar')
          query_score.set("challenge_id", poiChallenge);
          query_score.set("type","组织者");
          query_score.set("score",3);
        } else {
          console.log('joiner')
          query_score.set("booking_id", poiBooking);
          query_score.set("type", "参与者");
          query_score.set("score", 1);
        }
        query_score.save().then(res => {
          console.log(res)
        }).catch(err => {
          console.log(err);
        })

      })
    } else {
      e.detail.value.checklist.forEach(booking => {
        let query_score = Bmob.Query('Scores');
        let ids = booking.split(',');
        console.log(ids)
        let pointer_booking = Bmob.Pointer('Bookings')
        let poiBooking = pointer_booking.set(ids[0])
        let pointer_user = Bmob.Pointer('Users')
        let poiUser = pointer_user.set(ids[1])
        query_score.set("user_id", poiUser);
        query_score.set("booking_id", poiBooking);
        query_score.set("type", "参与者");
        query_score.set("score", 1);
        query_score.save().then(res => {
          console.log(res)
        }).catch(err => {
          console.log(err);
        })

      })
    }
  }
})