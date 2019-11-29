// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: process.env.env,
  traceUser: true,
})
const db = cloud.database();
const _ = db.command


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }

  let list_data = event.list;
  list_data._openid = wxContext.OPENID

  let list = await db.collection('list').add({ data: list_data });

  return list;



































}