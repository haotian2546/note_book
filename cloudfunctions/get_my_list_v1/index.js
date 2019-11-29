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
  if (!event.id) {
    //获取我的清单列表
    let list = (await db.collection('list').where({ _openid: wxContext.OPENID }).orderBy('create_time', 'desc').skip(event.page * 20).limit(20).get()).data;
    for (let i = 0; i < list.length; i++) {
      list[i].author = (await db.collection('user').where({
        _openid: wxContext.OPENID
      }).get()).data[0];
      list[i].count = (await db.collection('list_note').where({
        list: list[i]._id
      }).count()).total;
    }
    return list;
  } else {
    let the_list = (await db.collection('list').doc((event.id).toString()).get()).data;
    console.log(the_list)
    //当前清单内的记录数量
    the_list.count = (await db.collection('list_note').where({ list: event.id }).count()).total;

    //获取当前清单流水总和
    let list_notes = (await db.collection('list_note').where({ list: event.id }).get()).data;
    let total_num = 0;
    for (let i = 0; i < list_notes.length; i++) {
      total_num += list_notes[i].num * 1;
    }
    the_list.total_num = total_num;

    //作者信息
    let author = (await db.collection('user').where({ _openid: the_list._openid }).get()).data[0];
    the_list.author = author;


    //访客点击量加一
    if (the_list._openid !== wxContext.OPENID) {
      await db.collection('list').doc(event.id).update({
        data: { click: _.inc(1) }
      })
    };
    return the_list;
  }

}