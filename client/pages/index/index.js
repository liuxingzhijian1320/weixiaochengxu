Page({
  data:{
    num:0
  },
  bindchange(e){
    console.log(e.changedTouches[0].clientX, wx.getSystemInfoSync().windowWidth * 0.7)
    // console.log(e.detail.x, wx.getSystemInfoSync().windowWidth * 0.7)
    if (e.changedTouches[0].clientX >= parseInt(wx.getSystemInfoSync().windowWidth * 0.7+30)){
      wx.setStorage({
        key: 'isFirst',
        data: 'false',
      })
      wx.navigateTo({
        url: '../home/home'
      })
    }else{
      this.setData({
        num: 0
      })
    }
  },
  onHide(){
    this.setData({
      num:0
    })
  },
  goToCenter(){
    wx.navigateTo({
      url: '/pages/user/index',
    })
  }
})