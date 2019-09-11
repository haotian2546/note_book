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
  let list = (await db.collection('list_note').where({ list: event.id }).orderBy('create_time', 'desc').skip(event.page * 20).limit(20).get()).data;
  for (let i = 0; i < list.length; i++) {
    let author = (await db.collection('user').where({ _id: list[i].author }).get()).data[0];
    list[i].author = author;
  }
  return list;
}