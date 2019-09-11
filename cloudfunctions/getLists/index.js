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
  if (event.id) {
    let list = (await db.collection('list').where({ _id: event.id }).get()).data[0];
    let list_notes = (await db.collection('list_note').where({ list: event.id }).get()).data;
    //获取当前清单里的记录的数量
    list.count = (await db.collection('list_note').where({ list: event.id }).count()).total;

    //获取当前清单里的所有流水的总和
    let total_num = 0;
    for (let i = 0; i < list_notes.length; i++) {
      total_num += list_notes[i].num * 1;
    }
    list.total_num = total_num;

    let author = (await db.collection('user').where({ _id: list.author }).get()).data[0];
    list.author = author;
    return list;
  } else {
    let list = (await db.collection('list').where({ author: event.author }).orderBy('create_time', 'desc').skip(event.page * 20).limit(20).get()).data;
    for (let i = 0; i < list.length; i++) {
      list[i].author = (await db.collection('user').where({ _id: list[i].author }).get()).data[0];
      list[i].count = (await db.collection('list_note').where({ list: list[i]._id }).count()).total;
    }
    return list;
  }
}