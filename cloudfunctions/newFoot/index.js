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
  const wxContext = cloud.getWXContext();
  let user = (await db.collection('user').where({ _openid: wxContext.OPENID }).get()).data;//获取当前用户信息
  let list = (await db.collection('list').where({ _id: event.list_id }).get()).data;//获取当前清单信息
  let data = { user: user[0]._id, list_id: list[0]._id, create_time: (new Date()).getTime(), change_time: (new Date()).getTime() };
  let foot = (await db.collection('foot').where({ user: user[0]._id, list_id: list[0]._id }).get()).data;//判断是否存在足迹
  if (user.length === 1 && list.length === 1 && foot.length === 0 && user[0]._id !== list[0].author) {
    let newFoot = await db.collection('foot').add({ data });
    return { code: 200, data: newFoot, user: user, list: list, foot: foot }
  } else {
    return { code: 400, msg: 'fail', user: user, list: list, foot: foot }
  }
}