// pages/test/test.js
var util = require('../../utils/util.js')
var Bmob = require('../../utils/Bmob-1.6.7.min.js')
Page({

  /**
   * Page initial data
   */
  data: {
  photo:""

  },

  /**
   * Lifecycle function--Called when page load
   */
  
  // inPut:function(){
  //   var page=this
  //   console.log(page.data.photo)
  //   const pic = page.data.photo
  //   let file
  //   for (let item of pic) {
  //     file = Bmob.File(item.name, item);
  //   }
  //   file.save().then(res => {
  //     console.log(res.length);
  //     console.log(res);
  //   })
  // },
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
  
        console.log(_this.data.photo)
        var tempFilePaths = res.tempFilePaths
        var file;
        for (let item of tempFilePaths) {
          console.log('itemn', item)
          file = Bmob.File('abc.jpg', item);
        }
        file.save().then(res => {
          console.log(res.length);
          console.log(res);
          const file =res
          const query = Bmob.Query('Challenges');
          query.set('id', '91f596b27f')
            query.set('photo', res[0].url)
          query.save().then(res => {
            console.log(res)
          })
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