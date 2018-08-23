//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')
App({
  globalData: {},
  onLaunch: function(q) {
    qcloud.setLoginUrl(config.service.loginUrl);
    wx.ajax = (options) => {
      let opt = {};
      opt.url = options.url;
      options.data ? opt.data = options.data : null;
      options.header ? opt.header = options.header : null;
      options.method ? opt.method = options.method : null;
      options.dataType ? opt.dataType = options.dataType : null;
      options.responseType ? opt.responseType = options.responseType : null;
      opt.success = (res)=>{
        if (res.statusCode===200){
          if(typeof options.success === "function"){
            options.success(res)
          }
        }else{
          if (typeof options.fail === "function") {
            wx.showToast({
              title:"获取网络资源失败",
              icon:"none"
            })
            options.fail(res)
          }
        }
      }
      wx.request(opt)
    }
  }
})