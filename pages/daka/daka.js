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
    query.include('challenge_id', 'user_id','challenge_id.user_id','user_id.department_id','challenge_id.user_id.department_id');
    query.find().then(res => {
      console.log(res);
      page.setData({
        challenge: res[0].challenge_id,
        bookings: res
      })
    }).catch(err => {
      console.log(err)
      const query_one = Bmob.Query('Challenges');
      query_one.include('user_id','user_id.department_id')
      query_one.get(challenge_id).then(res => {
        console.log(res);
        page.setData({
          challenge: res,
          bookings: []
        })
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
  onShow: function (options) {
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
    let must_info = [this.data.photoChoose].map(x => x ? true : false)
    if (must_info.includes(false)) {
      console.log('bad input')
      page.setData({
        must_input: must_info
      })
      wx.showModal({
        title: '提示',
        content: '必须上传打卡照片！',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else {
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
    let BUs = [];
    e.detail.value.checklist.forEach(ppl => {
      let bu = ppl.split(',')
      if(!BUs.includes(bu[2])){
        BUs.push(bu[2])
      }
    })
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
          if(BUs.length>1){
            query_score.set("score", 4.5);
          }else {
            query_score.set("score", 3);
          }
        } else {
          console.log('joiner')
          query_score.set("booking_id", poiBooking);
          query_score.set("type", "参与者");
          if(ids[2]==page.data.challenge.user_id.department_id.BU){
            query_score.set("score", 1);
          }else{
            query_score.set("score", 1.5);
          }
        }
        query_score.save().then(res => {
          console.log(res)
          const query_update = Bmob.Query('Challenges')
          query_update.get(page.data.challenge.objectId).then(res => {
            res.set('status','已打卡')
            res.save().then(res => {
              wx.switchTab({
                url: '../profile/profile',
              })
            })
          })

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
          const query_update = Bmob.Query('Challenges')
          query_update.get(page.data.challenge.objectId).then(res => {
            console.log(res)
            res.set('status', '已打卡')
            res.save().then(res => {
              wx.switchTab({
                url: '../profile/profile',
              })
            })
          })
        }).catch(err => {
          console.log(err);
        })

      })
    }
  }
  }
})