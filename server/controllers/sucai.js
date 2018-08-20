// 获取数据接口
const mysql = require("mysql");
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'womende1314521',
  database: 'dydun'
});
connection.connect();
module.exports = async (ctx, next) => {
  // 通过 Koa 中间件进行登录之后
  // 登录信息会被存储到 ctx.state.$wxInfo
  // 具体查看：
  let getData=()=>{
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM `icon` WHERE `jointlyId`=? limit ?,? ', [Number(ctx.query.jointlyId), Number((ctx.query.pageNumber-1) * ctx.query.pageSize), Number(ctx.query.pageSize)], function (error, results, fields) {
        if (error) throw error;
        resolve(results)
      });
    })
  }
  ctx.state.data = await getData()
}
