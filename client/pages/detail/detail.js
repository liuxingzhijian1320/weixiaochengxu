// pages/detail/detail.js
var config = require('../../config')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo: {},
    index: 0,
    money: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    wx.request({
      url: config.service.getOrderDetail + "?id=224",
      success: (res) => {
        console.log(res)
        let data = res.data.data[0];
        data.list = [JSON.parse(data.propid)];
        data.list[0].num = 1;
        data.props = JSON.parse(data.props);
        wx.getStorage({
          key: 'data',
          success: (res) => {
            data.drawBoard = res.data.drawBoards[data.drawBoardid];

            var list = []
            for (let i = 0; i < data.props.length; i++) {
              var flag = false;
              data.props[i].props.forEach((e) => {
                if (e.type === "BADGE") {
                  list.push({
                    url: e.url,
                    num: 1,
                    price: e.price,
                    name: "徽章"
                  })
                } else {
                  flag = true
                }
              })
              if (flag) {
                list.push({
                  url: data.props[i].bgUrl,
                  num: 1,
                  price: 15,
                  name: "印花"
                })
              }

            }
            console.log(list)
            let arr = [], money = 0;

            for (let i = 0; i < list.length; i++) {
              money += list[i].price;
              let flag = false;
              for (let j = 0; j < arr.length; j++) {
                if (list[i].url === arr[j].url) {
                  arr[j].num++;
                  flag = true
                }
              }
              if (!flag) {
                arr.push(list[i])
              }
            }
            console.log(arr)
            this.setData({
              orderInfo: data,
              list: arr,
              money: money
            })
          },
        })

      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  numReduce(e) {
    console.log(e)
    if (this.data.orderInfo.list[e.currentTarget.dataset.index].num === 1) {
      wx.showToast({
        title: "件数不能小于一件哦...",
        icon: "none",
        success: () => {
          setTimeout(() => {
            wx.hideToast()
          }, 1500)
        }
      })
    } else {
      this.data.orderInfo.list[e.currentTarget.dataset.index].num--;
      this.setData({
        orderInfo: this.data.orderInfo
      })
    }
  },
  numAdd(e) {
    console.log(e)
    this.data.orderInfo.list[e.currentTarget.dataset.index].num++;
    this.setData({
      orderInfo: this.data.orderInfo
    })
  },
  add() {
    let obj = {};
    obj.num = 1;
    if (this.data.orderInfo.drawBoard.size[0].propNameId === 1) {
      obj.color_id = this.data.orderInfo.drawBoard.size[0].prop[0].id;
      obj.size_id = this.data.orderInfo.drawBoard.size[1].prop[0].id
    } else {
      obj.color_id = this.data.orderInfo.drawBoard.size[1].prop[0].id;
      obj.size_id = this.data.orderInfo.drawBoard.size[0].prop[0].id
    }
    this.data.orderInfo.list.push(obj)
    this.setData({
      orderInfo: this.data.orderInfo
    })
  },
  reduce() {
    this.data.orderInfo.list.pop();
    this.setData({
      orderInfo: this.data.orderInfo
    })
  },
  propChange(e) {
    for (let i = 0; i < this.data.orderInfo.drawBoard.size.length; i++) {
      if (this.data.orderInfo.drawBoard.size[i].propNameId === e.currentTarget.dataset.propid) {
        switch (e.currentTarget.dataset.propid) {
          case 1:
            this.data.orderInfo.list[e.currentTarget.dataset.index].color_id = Number(this.data.orderInfo.drawBoard.size[i].prop[e.detail.value].id);
            break;
          case 2:
            this.data.orderInfo.list[e.currentTarget.dataset.index].size_id = Number(this.data.orderInfo.drawBoard.size[i].prop[e.detail.value].id);
            break;
        }
      }

    }
    this.setData({
      orderInfo: this.data.orderInfo
    })
  },
  confirm() {
    wx.navigateTo({
      url: '/pages/confirm/confirm',
    })
  }
})