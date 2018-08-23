
var app = getApp()
Page({
  data: {
    userInfo: {
      skey: "271c4ae01eba9bd2b92710084077a306ae45577b",
      userinfo: {
        avatarUrl:      "https://wx.qlogo.cn/mmopen/vi_32/p0IQRHqwFmQSwyq2vcpH51vLpcIjhiaF51WyiaqcwVSiaib8TXSy78QAouO54klwdzWupuF8lkrytwBamOrxJ6E7yg/132",
        city: "Changsha",
        country: "China",
        gender: 1,
        language: "zh_CN",
        nickName: "風雲",
        openId: "oibGZ5T25D86T453gtvVYzMBQNXU",
        province: "Hunan",
      },
      watermark: {
        appid: "wxfda87a89c770c9c8",
        timestamp: 1534993277
      }
    },
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    orderItems: [
      {
        typeId: 0,
        name: '优惠券',
        url: 'coupon',
        imageurl: 'https://lg-j2pfsko2-1257172761.cos.ap-shanghai.myqcloud.com/coupons.png',
      },
      {
        typeId: 1,
        name: '礼品卡',
        url: 'giftCard',
        imageurl: 'https://lg-j2pfsko2-1257172761.cos.ap-shanghai.myqcloud.com/gift.png',
      },
      {
        typeId: 2,
        name: '我的订单',
        url: 'order',
        imageurl: 'https://lg-j2pfsko2-1257172761.cos.ap-shanghai.myqcloud.com/myorder.png'
      },
      {
        typeId: 3,
        name: '在线客服',
        url: 'service',
        imageurl: 'https://lg-j2pfsko2-1257172761.cos.ap-shanghai.myqcloud.com/inline.png'
      }
    ],
  },
  //事件处理函数
  toOrder: function (e) {
    if (e.currentTarget.dataset.type === "优惠券"){
      wx.navigateTo({
        url: '/pages/coupon/coupon'
      })
    } else if (e.currentTarget.dataset.type === "礼品卡") {
      wx.navigateTo({
        url: '/pages/giftCard/giftCard'
      })
    } else if (e.currentTarget.dataset.type === "我的订单") {
      wx.navigateTo({
        url: '/pages/myorder/myorder'
      })
    } else if (e.currentTarget.dataset.type === "在线客服") {
      console.log("跳转联系客服")
      // wx.navigateTo({
      //   url: '../service/service'
      // })
    }
  },
  toTemplate: function (e) {
    wx.navigateTo({
      url: '/pages/mytemplate/mytemplate',
    })
  },
  calling: function (e) {
    console.log(e)
    wx.makePhoneCall({
      phoneNumber: '10086',
    })
  },
  onLoad: function () {
    wx.getStorage({
      key: '',
      success: function(res) {},
    })
  },

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})