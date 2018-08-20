//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

App({
  globalData:{},
  onLaunch: function(q) {
    qcloud.setLoginUrl(config.service.loginUrl);
   
  }
})