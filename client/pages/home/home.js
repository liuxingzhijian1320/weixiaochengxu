// pages/home/home.js
var config = require('../../config');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: [],
    data: {},
    drawBoards: [],
    indx: 0,
    showPop: false,
    imgUrls: [],
    id: 0,
    color_id: 0,
    size_id: 0,
    oldNum: -1,
    newNum: 0,
    num:90,
  },
  show(e) {
    console.log(this.data.data[e.currentTarget.dataset.id])
    let color_id = 0,
      size_id = 0;
    for (let i = 0; i < this.data.data[e.currentTarget.dataset.id].size.length; i++) {
      switch (this.data.data[e.currentTarget.dataset.id].size[i].propNameId) {
        case 1:
          color_id = this.data.data[e.currentTarget.dataset.id].size[i].prop[0].id;
          break;
        case 2:
          size_id = this.data.data[e.currentTarget.dataset.id].size[i].prop[0].id;
          break;
      }
    }
    this.setData({
      showPop: true,
      id: e.currentTarget.dataset.id,
      color_id: color_id,
      size_id: size_id
    })
  },
  hide(e) {
    if (e.target.id === "bg") {
      this.setData({
        showPop: false
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.getStorage({
      key: 'data',
      success:  (res)=> { 
        console.log(res)
        let obj = res.data.drawBoards,
          drawBoards = [],
          num = 0;
        for (let key in obj) {
          num++;
          drawBoards.push(obj[key])
        }
        this.setData({
          nav: res.data.cats,
          drawBoards: drawBoards,
          indx: res.data.cats[0].id,
          data: res.data.drawBoards,
          newNum: num
        })
        setTimeout(() => {
          this.setData({
            num: 0
          })
        })
        wx.hideLoading()
      },
      fail:()=>{
          wx.showLoading({
            title: "请求资源中...",
            mask: true,
          })
          wx.request({
            url: config.service.getDataUrl,
            success: (res) => {
              let obj = res.data.data.drawBoards,
                drawBoards = [],
                num = 0;
              console.log(res.data.data)
              wx.setStorage({
                key: 'data',
                data: res.data.data,
              })
              for (let key in obj) {
                num++;
                drawBoards.push(obj[key])
              }
              this.setData({
                nav: res.data.data.cats,
                drawBoards: drawBoards,
                indx: res.data.data.cats[0].id,
                data: res.data.data.drawBoards,
                newNum: num
              })
              setTimeout(() => {
                this.setData({
                  num: 0
                })
              })
              wx.hideLoading()
            }
          })
      }
    })
    
    
  },
  click(e) {
    let obj = app.globalData.data.drawBoards,
      drawBoards = [];
    let arr = app.globalData.data.cats[e.currentTarget.dataset.index].drowBoard.sort()
    for (let i = 0; i < arr.length; i++) {
      drawBoards.push(obj[arr[i]])
    }
    this.setData({
      indx: e.currentTarget.dataset.index,
      drawBoards: drawBoards,
      oldNum: this.data.newNum,
      newNum: drawBoards.length,
      num:90
    })
    setTimeout(() => {
      this.setData({
        num: 0
      })
    })
  },
  propch(e) {
    switch (e.currentTarget.dataset.propid) {
      case 1:
        this.setData({
          color_id: e.currentTarget.dataset.id
        });
        break;
      case 2:
        this.setData({
          size_id: e.currentTarget.dataset.id
        });
        break;
    }
  },
  order(e) {
    wx.navigateTo({
      url: '/pages/order/order?id=' + this.data.id + '&color=' + this.data.color_id + '&size=' + this.data.size_id + '&catId=' + this.data.indx,
    })
  }
})