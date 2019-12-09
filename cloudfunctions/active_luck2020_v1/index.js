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

  let lucks = [
    '养到心爱的宠物',
    '卡里有钱',
    '运气爆棚',
    '桃花拉满',
    '喝奶茶不长胖',
    '找到对象',
    '水逆退散',
    '来一场说走就走的旅行',
    '工资翻倍',
    '集满五福',
    '锦鲤上身',
    '嗨嗨皮皮',
    '抖音收获百万赞',
    '收到一打压岁钱',
    '喜得贵子',
    '睡到自然醒',
    '抖音吸粉无数',
    '过一个浪漫的情人节',
    '心想事成',
    '与爱人一起看雪',
    '一家人健健康康',
    '暴富',
    '脱单',
    '父母健康',
    '兜里有糖',
    '狂吃不胖',
    '没有抑郁',
    '身边小可爱一切都好',
    '交很多朋友',
    '顽皮',
    '偶遇爱豆',
    '瘦十斤',
    '拥有完美身材',
    '环球旅行',
    '世界和平',
    '家和万事兴',
    '生日收到心仪的礼物',
    '抢红包手气最佳',
    '玩儿',
    '抢到杰伦演唱会门票',
    '身边的小婊砸一切安好',
    '没有加班',
    '无忧无虑',
    '2020有你',
    '出门见喜',
    '没有失眠',
    '没有脱发',
    '两个月年终奖到账',
    '不再失眠',
    '遇见最爱的人',
    '没有焦虑',
    '尝到各种美食',
    '吃遍大江南北',
    '打卡心仪的景点',
  ];
  let text_list = [];
  for (let i = 0; i < lucks.length; i++) {
    if (text_list.length < 5) {
      text_list = [...new Set(text_list)];
      let string = lucks[Math.round(Math.random() * (lucks.length - 1))];
      text_list = text_list.concat(string);
    }
  }






  let user = (await db.collection('user').where({ _openid: wxContext.OPENID }).get()).data[0];
  let active = (await db.collection('active').where({ _openid: wxContext.OPENID, active_name: 'luck2020' }).get()).data;
  if (active.length > 0) {
    active[0].luck_list = text_list;
    return active[0];
  } else {
    let data = {};
    data._openid = wxContext.OPENID;
    data.active_name = 'luck2020';
    data.luck_list = text_list;
    data.avatarUrl = user.avatarUrl;
    data.niceName = user.nickName;
    data.create_time = (new Date()).getTime();
    data.change_time = (new Date()).getTime();
    await db.collection('active').add({ data: data });
    let new_active = (await db.collection('active').where({ _openid: wxContext.OPENID, active_name: 'luck2020' }).get()).data[0];
    new_active.luck_list = text_list;
    return new_active;
  }


}