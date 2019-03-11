var Bmob = require('../../utils/Bmob-1.6.7.min.js')
// pages/create/create.js
const app = getApp()
const dateTimePicker = require('../../utils/dateTimePicker.js');
Page({

  /**
   * Page initial data
   */
  data: {
    categories: ['跑步', '健身', '羽毛球', '篮球', '足球', '登山', '游泳', '网球','舞蹈','瑜珈','飞盘','滑板','滑雪','骑行','健走','露营','徒步','水上运动','其他'],
    index: 0,
    capacity: 1,
    start_time: "2018-12-30 17:00",
    end_time: "2018-12-30 17:00"
    // photo_url: "http://lc-sJYm7PNe.cn-n1.lcfile.com/20df49b6ae9de0362345"
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

  onLoad: function (options) {
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj1.dateTimeArray.pop();
    var lastTime = obj1.dateTime.pop();
    this.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime,
      dateTimeArray2: obj1.dateTimeArray,
      dateTime2: obj1.dateTime
    });
    wx.getStorage({
      key: 'userinfo',
      success: (res) => {
        console.log(res);
        this.setData({
          user_id: res.data.objectId
        })
        console.log(this.data)
      }
    })

  },



  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      level: e.detail.value
    })
  },

  takePhoto: function () {
    let photo_url = '';
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(111, res)
        let tempFilePath = res.tempFilePaths[0];
        that.data.imageData = tempFilePath;
        that.setData(that.data);

        new AV.File('file-name', {
          blob: {
            uri: tempFilePath,
          },
        }).save().then(
          file => {
            console.log(101, file.url());
            photo_url = file.url();
            that.setData({ photo_url: photo_url })
          }
        ).catch(console.error);
      }
    });
  },




  bindPickerChange1: function (e) {
    let page = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    console.log(e)
    page.setData({
      category: page.data.categories[e.detail.value]
    });

  },

  bindSubmit: function (e) {
    let page = this;
    console.log(e)

    const pointer = Bmob.Pointer('Users')
    const poiID = pointer.set(page.data.user_id)
    const query = Bmob.Query('Challenges')
    query.set('user_id', poiID)
    // query.set("user_id", page.data.user_id)
    query.set("category", e.detail.value.category)
    query.set('name', e.detail.value.category)
    query.set("description", e.detail.value.description)
    query.set("photo", page.data.photoChoose[0].url)
    query.set('data_photo', page.data.photoChoose[0].url)
    query.set("status", "已打卡")
    query.save().then(res => {
      console.log(res)
      const pointer_sports = Bmob.Pointer('Challenges')
      const poiSports = pointer_sports.set(res.objectId)
      const query_score = Bmob.Query('Scores')
      query_score.set('user_id',poiID)
      query_score.set('challenge_id',poiSports)
      query_score.set('type','组织者')
      query_score.set('score',1)
      query_score.save().then(res => {
        console.log(res)
        wx.switchTab({
          url: '/pages/profile/profile',
        })
      })
    }).catch(err => {
      console.log(err)
    })
  },


  onGreater: function () {
    let n = this.data.capacity;
    this.setData({
      capacity: n + 1
    })
  },

  onLess: function () {
    let n = this.data.capacity;
    if (n <= 1) {
      this.setData({
        capacity: 1
      })
    } else {
      this.setData({
        capacity: n - 1
      })
    }
  },

  countText: function (e) {
    this.setData({
      description: e.detail.value
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

  }
})