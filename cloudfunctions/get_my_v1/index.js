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


  let income = 0;
  let expend = 0;
  let notes = (await db.collection('note').where({ _openid: wxContext.OPENID }).get()).data;
  let income_num = (await db.collection('note').where({ _openid: wxContext.OPENID, type: 'income' }).count()).total;
  let expend_num = (await db.collection('note').where({ _openid: wxContext.OPENID, type: 'expend' }).count()).total;
  for (let i = 0; i < notes.length; i++) {
    if (notes[i].type === "income") {
      income = income * 1 + notes[i].income * 1
    } else if (notes[i].type === "expend") {
      expend = expend * 1 + notes[i].expend * 1
    }
  };
  return {
    income, expend, income_num, expend_num, user
  }
}