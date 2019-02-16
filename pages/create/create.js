var Bmob = require('../../utils/Bmob-1.6.7.min.js')
// pages/create/create.js
const app = getApp()
const dateTimePicker = require('../../utils/dateTimePicker.js');
Page({

  /**
   * Page initial data
   */
  data: {
    levels: ['junior', 'middle', 'expert'],
    region: ["Province", "City", "District"],
    categories: ['All', 'running', 'fitness', 'badminton', 'basketball', 'football', 'hiking', 'swimming', 'tennis'],
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
          _this.setData({
            photoChoose:res
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
      key: 'current_user',
      success: (res) => {
        console.log(res),
          this.setData({
            user_id: res.data.id
          })
      }
    })

  },
  changeDateTime1(e) {
    console.log(11, e);
    this.setData({ dateTime1: e.detail.value });
  },
  changeDateTime2(e) {
    console.log(11, e);
    this.setData({ dateTime2: e.detail.value });
  },
  changeDateTimeColumn1(e) {
    console.log(12, e);
    var arr = this.data.dateTime1, dateArr = this.data.dateTimeArray1;
    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr,
      start_time: `${dateArr[0][arr[0]]}-${dateArr[1][arr[1]]}-${dateArr[2][arr[2]]} ${dateArr[3][arr[3]]}:${dateArr[4][arr[4]]}`
    });

  },

  changeDateTimeColumn2(e) {
    console.log(12, e);
    var arr = this.data.dateTime2, dateArr = this.data.dateTimeArray2;
    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
    this.setData({
      dateTimeArray2: dateArr,
      dateTime2: arr,
      end_time: `${dateArr[0][arr[0]]}-${dateArr[1][arr[1]]}-${dateArr[2][arr[2]]} ${dateArr[3][arr[3]]}:${dateArr[4][arr[4]]}`
    });
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

  previewMyImage: function (files) {
    console.log(103, files.currentTarget)
    console.log(this.data.imageData)
    wx.previewImage({
      // current: files.currentTarget.id,  // number of index or file path
      current: this.data.imageData,
      urls: [this.data.imageData]  // Array of temp files
    })
  },

  selectLocation: function (options) {
    let page = this
    wx.chooseLocation({
      success: function (res) {
        console.log(res);
        page.setData(
          {
            address: res.address,
            latitude: res.latitude,
            longitude: res.longitude
          }
        );
        var regex = /^(北京市|天津市|重庆市|上海市|香港特别行政区|澳门特别行政区)/;
        var REGION_PROVINCE = [];
        var addressBean = {
          REGION_PROVINCE: null,
          REGION_COUNTRY: null,
          REGION_CITY: null,
          ADDRESS: null
        };
        function regexAddressBean(address, addressBean) {
          regex = /^(.*?[市州]|.*?地区|.*?特别行政区)(.*?[市区县])(.*?)$/g;
          var addxress = regex.exec(address);
          addressBean.REGION_CITY = addxress[1];
          addressBean.REGION_COUNTRY = addxress[2];
          addressBean.ADDRESS = addxress[3] + "(" + res.name + ")";
          console.log(addxress);
        }
        if (!(REGION_PROVINCE = regex.exec(res.address))) {
          regex = /^(.*?(省|自治区))(.*?)$/;
          REGION_PROVINCE = regex.exec(res.address);
          addressBean.REGION_PROVINCE = REGION_PROVINCE[1];
          regexAddressBean(REGION_PROVINCE[3], addressBean);
        } else {
          addressBean.REGION_PROVINCE = REGION_PROVINCE[1];
          regexAddressBean(res.address, addressBean);
        }
        page.setData({
          ADDRESS_1_STR:
            addressBean.REGION_PROVINCE + " "
            + addressBean.REGION_CITY + ""
            + addressBean.REGION_COUNTRY
        });
        page.setData(addressBean);
      }
    })
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      region: e.detail.value
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
    const query = Bmob.Query('Challenges');
    query.set("category", e.detail.value.category)
    query.set("name",e.detail.value.title)
    query.set("capacity", parseInt(e.detail.value.capacity))
    query.set("location", e.detail.value.address)
    query.set("start_time", page.data.start_time)
    query.set("end_time", page.data.end_time)
    query.set("description", e.detail.value.description)
    query.set("photo", page.data.photoChoose[0].url)
    query.save().then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
    // wx.request({
    //   // url: 'http://localhost:3000/api/v1/sports',
    //   url: app.globalData.url + '/sports',
    //   method: 'POST',
    //   data: {
    //     user_id: page.data.user_id,
    //     // page.data.user_id,
    //     title: e.detail.value.title,
    //     description: e.detail.value.description,
    //     category: e.detail.value.category || "",
    //     start_time: page.data.start_time || "",
    //     end_time: page.data.end_time || "",
    //     price: e.detail.value.price || 0,
    //     level: e.detail.value.level || "junior",
    //     capacity: e.detail.value.capacity || 1,
    //     address: page.data.address || "",
    //     photo: page.data.photo_url || "",
    //     province: page.data.REGION_PROVINCE || "",
    //     city: page.data.REGION_CITY || "",
    //     district: page.data.REGION_COUNTRY || "",
    //     latitude: page.data.latitude || "",
    //     longitude: page.data.longitude || ""
    //   },
    //   success: (res) => {
    //     console.log(res)
    //     wx.switchTab({
    //       url: '/pages/profile/profile',
    //     })
    //   }
    // })
  },

  back: function () {
    wx.switchTab({
      url: '/pages/profile/profile',
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