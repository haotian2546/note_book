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
  let listnote_data = event.listnote;
  let the_list = (await db.collection('list').doc(listnote_data.list).get()).data;
  if (the_list._openid === wxContext.OPENID) {
    listnote_data._openid = wxContext.OPENID
    let list_note = await db.collection('list_note').add({ data: listnote_data });
    return list_note;
  } else {
    return { msg: '没有权限' };
  }





}