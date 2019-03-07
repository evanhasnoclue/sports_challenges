var Bmob = require('../../utils/Bmob-1.6.7.min.js')
//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    options: [['请选择BU', '电商OEF', '迪脉DMI', '其他BU'], ['', 'IHSh111A', 'wPciOOOA','ZONzmmmo']],
    index: 0,
    userInfo: {},
    hasUserInfo: false,
    register: true,
    bad_filled: [false,false],
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    let page = this;
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        console.log('open_id',res)
        page.setData({
          open_id: res.data
        });
        const auto_login = Bmob.Query("Users");
        auto_login.equalTo('open_id','==',res.data);
        auto_login.find().then(res => {
          wx.setStorage({
            key: 'userinfo',
            data: res[0],
          })
        })
      }
    })
    wx.getStorage({
      key: 'userinfo',
      success: function(res) {
        console.log('userinfo',res)
        if(res.data.objectId){
          wx.switchTab({
            url: '../challenges/challenges',
          })
        }
      },
      fail(res) {
        page.setData({
          register: false
        })
      }
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    const query = Bmob.Query('Users');
    let page = this;
    wx.getStorage({
      key: 'openid',
      success: function(res) {
        console.log('openid',res)
        query.equalTo('open_id', '==', res.data)
        query.find().then(res => {
          if (res.length == 0) {
            page.setData({
              register: false
            })
          } else {
            page.setData({
              register: true
            })
            wx.setStorage({
              key: 'userinfo',
              data: res[0]
            })
            wx.switchTab({
              url: '../challenges/challenges',
            })
          }
        })
      },
    })

  },
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  bindRegister: function(e) {
    console.log(e)
    let page = this;
    let gender = '';
    let profile = e.detail.value.profile;
    let department = parseInt(e.detail.value.department)
    if(profile && department){
      wx.getStorage({
        key: 'openid',
        success: function(res) {
          const create_user = Bmob.Query('Users');
          create_user.set('username', page.data.userInfo.nickName);
          create_user.set('open_id', page.data.open_id);
          create_user.set('profile', profile.toUpperCase());
          const pointer = Bmob.Pointer('Departments')
          const department_pointer = pointer.set(page.data.options[1][department])
          create_user.set('department_id', department_pointer)
          if (page.data.userInfo.gender) {
            gender = '男';
          } else {
            gender = '女';
          };
          create_user.set('gender', gender);
          create_user.set('avatar', page.data.userInfo.avatarUrl);
          create_user.save().then(res => {
            console.log(res);
            wx.setStorage({
              key: 'userinfo',
              data: res
            })
            wx.switchTab({
              url: '../challenges/challenges'
            })
          }).catch(err => {
            console.log(err)
          })
        },
      })
    }else {
      console.log('0000')
      page.setData({
        bad_filled: [profile ? false : true, department ? false : true]
      })
    }

   }
})
