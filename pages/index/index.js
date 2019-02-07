var Bmob = require('../../utils/Bmob-1.6.7.min.js')
//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    register: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
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
    wx.setStorage({
      key: 'userinfo',
      data: app.globalData.userInfo,
    })
    const query = Bmob.Query('Users');
    let page = this;
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        page.setData({
          open_id: res.data
        });
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
            wx.redirectTo({
              url: '../challenges/challenges?user='+res[0].objectId,
            })
          }
        })
      }
    })
  },
  
  bindRegister: function(e) {
    console.log(e)
    let gender = '';
    const create_user = Bmob.Query('Users');
    create_user.set('username',this.data.userInfo.nickName);
    create_user.set('open_id',this.data.open_id);
    create_user.set('profile',e.detail.value.profile.toUpperCase());
    if(this.data.userInfo.gender){
      gender = '男';
    }else {
      gender = '女';
    };
    create_user.set('gender',gender);
    create_user.set('avatar',this.data.userInfo.avatarUrl);
    create_user.save().then(res => {
      console.log(res);
      wx.redirectTo({
        url: '../challenges/challenges?user_id='+res.objectId
      })
    }).catch(err => {
      console.log(err)
    })
  }
})
