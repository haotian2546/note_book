// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // env: 'de-a10948',
  env: process.env.env,
  traceUser: true,
})
const db = cloud.database();
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  let income = 0;
  let expend = 0;
  let list = (await db.collection('note').where({ author: event.author }).get()).data;
  let income_num = (await db.collection('note').where({ author: event.author, type: 'income' }).count()).total;
  let expend_num = (await db.collection('note').where({ author: event.author, type: 'expend' }).count()).total;
  for (let i = 0; i < list.length; i++) {
    if (list[i].type === "income") {
      income = income * 1 + list[i].income * 1
    } else if (list[i].type === "expend") {
      expend = expend * 1 + list[i].expend * 1
    }
  };
  return {
    income, expend, income_num, expend_num
  }

}