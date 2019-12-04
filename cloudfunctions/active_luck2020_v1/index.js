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
  let user = (await db.collection('user').where({ _openid: wxContext.OPENID }).get()).data[0];
  let active = (await db.collection('active').where({ _openid: wxContext.OPENID, active_name: 'luck2020' }).get()).data;
  if (active.length > 0) {
    return active[0];
  } else {
    let data = {};
    data._openid = wxContext.OPENID;
    data.active_name = 'luck2020';
    data.luck_list = event.luck;
    data.avatarUrl = user.avatarUrl;
    data.niceName = user.nickName;
    data.create_time = (new Date()).getTime();
    data.change_time = (new Date()).getTime();
    await db.collection('active').add({ data: data });
    let new_active = (await db.collection('active').where({ _openid: wxContext.OPENID, active_name: 'luck2020' }).get()).data[0];
    return new_active;
  }


}