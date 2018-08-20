// pages/order.js
const app = getApp()
var x1 = 0,
  y1 = 0;
var config = require('../../config')
var flag = true;
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
    deg1: 0,
    fonts: [],
    color: "#000000",
    fontId: 0,
    fontStyle: {
      bold: false,
      italic: false
    },
    query: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.query = options;
    wx.request({
      url: config.service.getDetailUrl + "?id=" + options.id,
      success: (res) => {
        console.log(res)
        this.setData({
          imgUrl: res.data.data.map((e, i) => {
            e.props = []
            return e
          })
        })
      }
    })
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
      case "fonts":
        wx.request({
          url: config.service.getFontsUrl,
          success: (res) => {
            console.log(res)
            this.setData({
              fonts: res.data.data,
              color: res.data.data.color[0],
              fontId: res.data.data.font[0].id
            })
          }
        })
        return;
      case "shangchuan":
        return;
    }
    wx.showLoading({
      title: "请求资源中...",
      mask: true,
    })
    wx.request({
      url: config.service.getSucaiListUrl + "?categoryType=" + categoryType + "&pageNumber=1&pageSize=100",
      success: (res) => {
        console.log(res)
        this.setData({
          sucaiList: res.data.data,
          sucaiListId: res.data.data[0].jointlyId
        })
        wx.request({
          url: config.service.getSucaiUrl + "?jointlyId=" + res.data.data[0].jointlyId + "&pageNumber=1&pageSize=6",
          success: (res) => {
            console.log(res)
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
    console.log(e.currentTarget.dataset.type)
    this.data.imgUrl[this.data.imgIndex].props.push({
      url: e.currentTarget.dataset.url,
      id: e.currentTarget.dataset.id,
      type: e.currentTarget.dataset.type,
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
  },
  // 大图中图标的删除事件
  moveclose(e) {
    this.data.imgUrl[this.data.imgIndex].props.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      images: this.data.imgUrl[this.data.imgIndex].props
    })
  },
  ////图标移动开始事件
  start(e) {
    this.setData({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      iconIndex: e.currentTarget.dataset.index
    })
  },
  //图标移动中事件
  move(e) {
    if (flag) {
      flag = false;
      setTimeout(() => {
        flag = true;
      }, 50)
      let arr = Object.assign({}, this.data.images, {})
      arr[e.currentTarget.dataset.index].position = {
        left: e.touches[0].clientX - this.data.x,
        top: e.touches[0].clientY - this.data.y
      }
      this.setData({
        images: arr
      })
    }
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
  },
  //图标缩放，旋转开始
  scaleStart(e) {

    let x = e.touches[0].clientX - ((125 + 175 + (e.currentTarget.dataset.type !== "BADGE" ? 75 : 25)) / 2) - this.data.images[e.currentTarget.dataset.index].left,
      y = e.touches[0].clientY - ((102 + 258.5 + (e.currentTarget.dataset.type !== "BADGE" ? 75 : 25)) / 2) - this.data.images[e.currentTarget.dataset.index].top,
      s = 0;
    x1 = ((125 + 175 + (e.currentTarget.dataset.type !== "BADGE" ? 75 : 25)) / 2) + this.data.images[e.currentTarget.dataset.index].left;
    y1 = ((102 + 258.5 + (e.currentTarget.dataset.type !== "BADGE" ? 75 : 25)) / 2) + this.data.images[e.currentTarget.dataset.index].top

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
      actionIndex: e.currentTarget.dataset.index,
      s: Math.pow((Math.pow(x, 2) + Math.pow(y, 2)), 0.5),
      deg1: angle
    })
  },
  //缩放，旋转
  scaleMove(e) {
    if (flag) {
      flag = false;
      setTimeout(() => {
        flag = true
      }, 50)
      let x = e.touches[0].clientX - x1,
        y = e.touches[0].clientY - y1,
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
      var obj = {

      }
      console.log(e.currentTarget.dataset.type)
      if (e.currentTarget.dataset.type !== "BADGE") {
        if (Math.abs(s / this.data.s - this.data.scale) >= 0.05) {
          obj.scale = s / this.data.s.toFixed(2)
        }
      }
      if (Math.abs(this.data.deg1 - angle) >= 5) {
        obj.rotate = parseInt(this.data.deg1 - angle)
      }
      this.setData(obj)
    }
  },
  //图标缩放，旋转结束
  scaleEnd(e) {
    let arr = Object.assign({}, this.data.images, {});
    this.data.imgUrl[this.data.imgIndex].props[e.currentTarget.dataset.index].scale = arr[e.currentTarget.dataset.index].scale = arr[e.currentTarget.dataset.index].scale * this.data.scale;
    this.data.imgUrl[this.data.imgIndex].props[e.currentTarget.dataset.index].rotate = arr[e.currentTarget.dataset.index].rotate = arr[e.currentTarget.dataset.index].rotate + this.data.rotate;
    this.setData({
      images: arr,
      actionIndex: -1,
      rotate: 0,
      scale: 1,
    });
    console.log(arr)
  },
  //文字切换颜色
  colorChange(e) {
    this.setData({
      color: e.currentTarget.dataset.color
    })
  },
  //切换字体
  fontChange(e) {
    this.setData({
      fontId: e.currentTarget.dataset.id
    })
  },
  //切换字体样式
  fontStyleChange(e) {
    this.data.fontStyle[e.currentTarget.dataset.prop] = !this.data.fontStyle[e.currentTarget.dataset.prop]
    this.setData({
      fontStyle: this.data.fontStyle
    })
  },
  //上传图片
  upLoadImg() {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        console.log(res)
        wx.uploadFile({
          url: config.service.uploadUrl,
          name: "img",
          filePath: res.tempFilePaths[0],
          success: (res) => {
            console.log(res)
          }
        })
      }
    })
  },
  //确定定制
  sure(e) {
    let obj = JSON.parse(JSON.stringify(this.data.imgUrl))
    obj.length = this.data.imgUrl.length;
    let res = Array.prototype.map.call(obj, (e, i) => {
      var p = e.width / 500;
      e.props = e.props.map((e) => {
        delete e.position;
        e.left = parseInt(e.left * 2 * p);
        e.top = parseInt(e.top * 2 * p);
        if (e.type === "BADGE") {
          e.width = parseInt(100 * p);
          e.height = parseInt(100 * p)
        } else {
          e.width = parseInt(300 * e.scale * p);
          e.height = parseInt(300 * e.scale * p)
        }
        delete e.url;
        return e
      })
      return e
    })
    console.log(res)
    var req = {
      drawBoardid: Number(this.data.query.id),
      propid: JSON.stringify({
        color_id: Number(this.data.query.color),
        size_id: Number(this.data.query.size)
      }),
      catId: Number(this.data.query.catId),
      props: JSON.stringify(res)
    }
    wx.request({
      url: config.service.createOrderUrl,
      data: req,
      method: "POST",
      success: (res) => {
        console.log(res.data.data.order_id)
        wx.navigateTo({
          url: '/pages/detail/detail?id=' + res.data.data.order_id,
        })
      }
    })
  }
})