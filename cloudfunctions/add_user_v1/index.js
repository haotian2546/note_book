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
  let user = await db.collection('user').where({ _openid: wxContext.OPENID }).get();
  if (user.data.length > 0) {
    return { message: '用户已存在', data: user.data[0] };
  } else {
    await db.collection('user').add({
      data: {
        nickName: '账上开花-' + (new Date()).getTime(),
        _openid: wxContext.OPENID,
        admin: 0,
        create_time: (new Date()).getTime(),
        change_time: (new Date()).getTime(),
      }
    });
    // let new_user1 = await db.collection('user').where({ _openid: wxContext.OPENID }).get();
    let income_tag = await db.collection('tag_in').orderBy('index', 'asc').get();
    let expend_tag = await db.collection('tag_out').orderBy('index', 'asc').get();
    await db.collection('note').add({
      data: {
        _openid: wxContext.OPENID,
        income: 88888,
        remark: '一月份工资🎉🎉🎉 （🌰 :长按可删除）',
        tag: income_tag.data[0]._id,
        type: 'income',
        create_time: (new Date()).getTime(),
        change_time: (new Date()).getTime(),
      }
    });
    await db.collection('note').add({
      data: {
        _openid: wxContext.OPENID,
        expend: 1000,
        remark: '发工资了庆祝一下🎉🎉🎉 （🌰 :长按可删除）',
        tag: expend_tag.data[0]._id,
        type: 'expend',
        create_time: (new Date()).getTime(),
        change_time: (new Date()).getTime(),
      }
    })
    return {
      message: '用户注册',
      data: user.data[0],
    };
  }
}