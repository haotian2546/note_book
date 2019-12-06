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
  // const wxContext = cloud.getWXContext()

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
  // await db.collection('test').add({
  //   data: {
  //     create_time: (new Date()).getTime(),
  //     change_time: (new Date()).getTime(),
  //   }
  // })
  // return;
  // let res = await cloud.openapi.subscribeMessage.send({
  //   touser: 'olQoO5Mui6vkH7PcmyPTaizndXOs',
  //   templateId: 'omeyfeahadsqOFuWsueHSw1OYHec9A0l9wcO6ZlLWCo',
  //   page: '/pages/note_add/note_add',
  //   data: {
  //     phrase2: {
  //       value: '自定义提醒内容'
  //     },
  //     time1: {
  //       value: (new Date()).getTime()
  //     }
  //   }
  // });
  // return res;
}