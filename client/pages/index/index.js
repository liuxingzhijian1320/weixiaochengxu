var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
Page({
  data:{
    num:0,
    login:false,
    flag:true
  },
  bindchange(e){
    if (e.changedTouches[0].clientX >= parseInt(wx.getSystemInfoSync().windowWidth * 0.7+30)){
      wx.navigateTo({
        url: '/pages/home/home'
      })
    }else{
      this.setData({
        num: 0
      })
    }
  },
  onLoad(){
    wx.getSetting({
      success:(res)=> {
        console.log(res)
        if (res.authSetting["scope.userInfo"]){
          this.getUserInfo();
        }else{
          this.setData({
            flag: false
          })
        }
      }
    })
  },
  onHide(){
    this.setData({
      num:0
    })
  },
  goToCenter(){
    wx.navigateTo({
      url: '/pages/user/user',
    })
  },
  getUserInfo(){
    const session = qcloud.Session.get()
    if (session) {
      // 第二次登录
      // 或者本地已经有登录态
      // 可使用本函数更新登录态
      qcloud.loginWithCode({
        success: res => {
          this.setData({
            flag: true
          })
        },
        fail: err => {
        }
      })
    } else {
      // 首次登录
      qcloud.login({
        success: res => {
          this.setData({
            flag: true
          })
        },
        fail: err => {
        }
      })
    }
  }
})