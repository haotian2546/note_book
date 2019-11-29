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
  let user = await db.collection('user').where({ _openid: wxContext.OPENID}).get();
  if(user.data.length>0){
    return { message: '用户已存在', data: user.data[0]};
  }else{
    let new_user=await db.collection('user').add({
      data:{
        nickName: '账上开花-' + (new Date()).getTime(),
        _openid: wxContext.OPENID,
        admin: 0,
        create_time: (new Date()).getTime(),
        change_time: (new Date()).getTime(),
      }
    });
    let new_user1 = await db.collection('user').where({ _openid: wxContext.OPENID }).get();
    return { message: '用户注册', data: user.data[0] };;
  }
}