/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'http://172.28.228.146:8080';

var config = {

  // 下面的地址配合云端 Demo 工作
  service: {
    host,

    // 登录地址，用于建立会话
    loginUrl: `${host}/weapp/login`,

    // 测试的请求地址，用于测试会话
    requestUrl: `${host}/weapp/user`,

    // 测试的信道服务地址
    tunnelUrl: `${host}/weapp/tunnel`,

    // 上传图片接口
    uploadUrl: `${host}/weapp/upload`,
    // 获取数据接口
    getDataUrl: `${host}/api/v1/data`,
    // 获取数据接口
    getSucaiListUrl: `${host}/api/v1/sucai_type`,
    // 获取数据接口
    getSucaiUrl: `${host}/api/v1/sucai_list`,
    getFontsUrl: `${host}/api/v1/fonts`,
    getDetailUrl: `${host}/api/v1/img_detail`,
    createOrderUrl: `${host}/weapp/createOrder`,
    getOrderDetail: `${host}/weapp/order`,
  }
};

module.exports = config;
