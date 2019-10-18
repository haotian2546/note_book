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
  let user = (await db.collection('user').where({ _openid: wxContext.OPENID }).get()).data;
  let sees = (await db.collection('foot').where({ user: user[0]._id }).orderBy('create_time', 'desc').skip(event.page * 20).limit(20).get()).data;
  for (let i = 0; i < sees.length; i++) {
    sees[i] = ((await db.collection('list').where({ _id: sees[i].list_id }).get()).data)[0]
  }
  return sees
}