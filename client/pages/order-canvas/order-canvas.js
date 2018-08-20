// pages/order.js
const app = getApp()
var config = require('../../config');
const ctx = wx.createCanvasContext('myCanvas');
ctx.setLineDash([2, 3], 5)
var draw=(a)=>{
  console.log(a.data.images)
  a.data.images.forEach((e, i) => {
    // ctx.translate(0,0)
    // ctx.translate(e.left + 87  +75, e.top + 129 + 75)
    ctx.rotate(15*Math.PI/180)
    ctx.drawImage(e.url + "?x-oss-process=image/resize,m_lfit,w_100", e.left, e.top ,75*e.scale,75*e.scale);
    ctx.rect(e.left, e.top , 75 * e.scale, 75 * e.scale)
    ctx.stroke()
    ctx.drawImage("https://l0vwp10g.qcloud.la/section-close.png?x-oss-process=image/resize,m_lfit,w_100", e.left - 7.5, e.top+67.5,15,15);
    ctx.drawImage("https://l0vwp10g.qcloud.la/section-magnify.png?x-oss-process=image/resize,m_lfit,w_100", e.left+75 - 7.5, e.top + 67.5, 15, 15)
  })
  ctx.draw()
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: [],
    images: [],
    imgIndex: 0, //正反左右显示下标
    flag: "all", //控制底部显示模块
    sucaiList: [], //素材标题列表
    sucaiListId: 0, //素材id
    sucai: [], //素材小图标列表
    page: 1,
    scrollLeft: 0, //素材小图标的横向滚动条位置
    iconIndex: -1, //大图中选中的图标下标
    s: 0, //缩放时触摸点离图表中的距离,
    scale: 1, //缩放比例,
    rotate: 0,
    x: 0,
    y: 0,
    deg1: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imgUrl: app.globalData.data.drawBoards[options.id].imgs.map((e, i) => {
        return {
          url: e,
          props: []
        }
      })
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
  changeImg(e) {
    this.setData({
      imgIndex: e.currentTarget.dataset.index,
      images: this.data.imgUrl[e.currentTarget.dataset.index].props
    })
  },
  //获取素材、徽章、联名的列表数据
  getsucaiList(e) {
    this.setData({
      flag: e.currentTarget.dataset.info,
      sucai: [],
      sucaiList: []
    })
    var categoryType = ""
    switch (e.currentTarget.dataset.info) {
      case "sucai":
        categoryType = "PRINTING";
        break;
      case "huizhang":
        categoryType = "BADGE";
        break;
      case "lianming":
        categoryType = "JOINTLY";
        break;
    }
    wx.showLoading({
      title: "请求资源中...",
      mask: true,
    })
    wx.request({
      url: config.service.getSucaiListUrl + "?categoryType=" + categoryType + "&pageNumber=1&pageSize=100",
      success: (res) => {
        this.setData({
          sucaiList: res.data.data,
          sucaiListId: res.data.data[0].jointlyId
        })
        wx.request({
          url: config.service.getSucaiUrl + "?jointlyId=" + res.data.data[0].jointlyId + "&pageNumber=1&pageSize=6",
          success: (res) => {
            this.setData({
              sucai: res.data.data,
            })
            wx.hideLoading()
          },
          complete() {
            wx.hideLoading()
          }
        })
      }
    })
  },
  closetop() {
    this.setData({
      flag: "all",
    })
  },
  //获取素材、徽章、联名的列表下图标数据
  getsucai(e) {
    this.setData({
      sucaiListId: e.currentTarget.dataset.id,
      page: 1,
      scrollLeft: 0
    })
    wx.showLoading({
      title: "请求资源中..."
    })
    wx.request({
      url: config.service.getSucaiUrl + "?jointlyId=" + this.data.sucaiListId + "&pageNumber=1&pageSize=6",
      success: (res) => {
        this.setData({
          sucai: res.data.data,
        });
        wx.hideLoading()
      }
    })
  },
  //小图标向右滑动到底的加载事件
  load(e) {
    this.setData({
      page: this.data.page + 1
    })
    wx.showLoading({
      title: "请求资源中..."
    })
    wx.request({
      url: config.service.getSucaiUrl + "?jointlyId=" + this.data.sucaiListId + "&pageNumber=" + this.data.page + "&pageSize=6",
      success: (res) => {
        this.setData({
          sucai: this.data.sucai.concat(res.data.data),
        })
        wx.hideLoading()
      }
    })
  },
  //点击图标添加到大图
  addImg(e) {
    wx.downloadFile({
      url: e.currentTarget.dataset.url +"?x-oss-process=image/resize,m_lfit,w_100", //仅为示例，并非真实的资源
      success:  (res)=> {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          this.data.imgUrl[this.data.imgIndex].props.push({
            url: res.tempFilePath,
            id: e.currentTarget.dataset.id,
            top: 0,
            left: 0,
            scale: 1,
            rotate: 0,
            position: {
              left: 0,
              top: 0
            }
          })
          this.setData({
            images: this.data.imgUrl[this.data.imgIndex].props
          })
          draw(this)
        }
      }
    })
    
  },
  //大图中图标的点击事件
  movetap(e) {
    console.log(e)
    // if (this.data.iconIndex == e.currentTarget.dataset.index) {
    //   this.setData({
    //     iconIndex: -1
    //   })
    // } else {
    //   this.setData({
    //     iconIndex: e.currentTarget.dataset.index
    //   })
    // }
  },
  
  // 大图中图标的删除事件
  moveclose(e) {
    this.data.imgUrl[this.data.imgIndex].props.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      images: this.data.imgUrl[this.data.imgIndex].props
    })
    this.draw(this)
  },
  ////图标移动开始事件
  start(e) {
    this.setData({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    })
  },
  //图标移动中事件
  move(e) {
    let arr = Object.assign({}, this.data.images, {})
    arr[e.currentTarget.dataset.index].position = {
      left: e.touches[0].clientX - this.data.x,
      top: e.touches[0].clientY - this.data.y
    }
    this.setData({
      images: arr
    })
    this.draw()
  },
  //图标移动结束
  end(e) {
    let arr = Object.assign({}, this.data.images, {})
    this.data.imgUrl[this.data.imgIndex].props[e.currentTarget.dataset.index].left = arr[e.currentTarget.dataset.index].left = arr[e.currentTarget.dataset.index].left + arr[e.currentTarget.dataset.index].position.left;
    this.data.imgUrl[this.data.imgIndex].props[e.currentTarget.dataset.index].top = arr[e.currentTarget.dataset.index].top = arr[e.currentTarget.dataset.index].top + arr[e.currentTarget.dataset.index].position.top;
    arr[e.currentTarget.dataset.index].position = {
      left: 0,
      top: 0
    };
    this.setData({
      images: arr
    })
    this.draw()
  },
  //图标缩放，旋转开始
  scaleStart(e) {

    let x = e.touches[0].clientX - ((125 + 175 + 75) / 2) - this.data.imgUrl[this.data.imgIndex].props[e.currentTarget.dataset.index].left,
      y = e.touches[0].clientY - ((102 + 258.5 + 75) / 2) - this.data.imgUrl[this.data.imgIndex].props[e.currentTarget.dataset.index].top,
      s = 0;
    let cos = Math.abs(x) / Math.pow((Math.pow(x, 2) + Math.pow(y, 2)), 0.5);
    var radina = Math.acos(cos);
    var angle = Math.floor(180 / (Math.PI / radina));
    if (x > 0) {
      if (y > 0) {
        angle = 360 - angle
      }
    } else {
      if (y > 0) {
        angle += 180
      } else {
        angle = 180 - angle
      }
    }
    this.setData({
      s: Math.pow((Math.pow(x, 2) + Math.pow(y, 2)), 0.5),
      deg1: angle,
      actionIndex: e.currentTarget.dataset.index
    })
    this.draw()
  },
  //缩放，旋转
  scaleMove(e) {
    let x = e.touches[0].clientX - ((125 + 175 + 75) / 2) - this.data.imgUrl[this.data.imgIndex].props[e.currentTarget.dataset.index].left,
      y = e.touches[0].clientY - ((102 + 258.5 + 75) / 2) - this.data.imgUrl[this.data.imgIndex].props[e.currentTarget.dataset.index].top,
      s = 0;

    s = Math.pow((Math.pow(x, 2) + Math.pow(y, 2)), 0.5);

    let cos = Math.abs(x) / s;
    var radina = Math.acos(cos);
    var angle = Math.floor(180 / (Math.PI / radina));
    if (x > 0) {
      if (y > 0) {
        angle = 360 - angle
      }
    } else {
      if (y > 0) {
        angle += 180
      } else {
        angle = 180 - angle
      }
    }
    this.setData({
      scale: s / this.data.s,
      rotate: this.data.deg1 - angle
    })
    this.draw()
  },
  //图标缩放，旋转结束
  scaleEnd(e) {
    let arr = Object.assign({}, this.data.images, {});
    this.data.imgUrl[this.data.imgIndex].props[e.currentTarget.dataset.index].scale = arr[e.currentTarget.dataset.index].scale = arr[e.currentTarget.dataset.index].scale * this.data.scale
    this.data.imgUrl[this.data.imgIndex].props[e.currentTarget.dataset.index].rotate = arr[e.currentTarget.dataset.index].rotate = arr[e.currentTarget.dataset.index].rotate + this.data.rotate
    this.setData({
      images: arr,
      actionIndex: -1,
      rotate: 0,
      scale: 1
    })
    this.draw()
  },
  //确定定制
  sure(e) {
    let res = this.data.imgUrl.map((e, i) => {
      e.props = e.props.map((e) => {
        delete e.position;
        return e
      })
      return e
    })
    console.log(res)
  }
})