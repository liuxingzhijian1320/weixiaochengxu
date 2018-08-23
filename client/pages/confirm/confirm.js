// pages/confirm/confirm.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: null,
    flag: false,
    isAddAddress:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting["scope.address"]) {
          this.setData({
            flag:false
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  getAddress() {
    wx.getSetting({
      success: (res) => {
        console.log(res)
        if (res.authSetting["scope.address"]) {
          wx.chooseAddress({
            success: (res) => {
              let obj = {};
              obj.address = res.provinceName + res.cityName + res.countyName + res.detailInfo;
              obj.telNumber = res.telNumber;
              obj.nationalCode = res.nationalCode;
              obj.userName = res.userName;
              this.setData({
                address: obj,
                isAddAddress:true
              })
              console.log(obj)
              console.log(res)
              console.log(res.postalCode)
              console.log(res.provinceName)
              console.log(res.cityName)
              console.log(res.countyName)
              console.log(res.detailInfo)
              console.log(res.nationalCode)
              console.log(res.telNumber)
            },
            fail: () => {
              console.log("取消授权")
            }
          })
        } else {
          wx.authorize({
            scope: "scope.address",
            success: () => {

            },
            fail: () => {
              this.setData({
                flag: true
              })
              console.log("取消授权")
            }
          })
        }
      }
    })

  },
  confirm() {
    // let stringSignTemp = "appId=wx7bfa06a3597da01d&nonceStr=adasdasdasds&package="
    // wx.requestPayment({
    //   timeStamp: parseInt(new Date().getTime() / 1000),
    //   nonceStr: "adasdasdasds",
    //   package: "prepay_id=asdsfsasas",
    //   signType: "MD5",
    //   paySign: MD5(stringSignTemp).toUpperCase()
    // })
    if (this.data.isAddAddress){
        console.log("开始支付流程")
    }else{
      wx.showToast({
        title: '请先选择收货地址',
        icon:"none"
      })
    }
  }
})