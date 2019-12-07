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
  let active = (await db.collection('active').where({ _openid: wxContext.OPENID, active_name: 'luck2020' }).get()).data;
  if (active.length > 0) {
    return active[0];
  } else {
    let data = {};
    let lucks = [
      '瘦十斤',
      '拥有完美身材',
      '人鱼线附体',
      '马甲线附体',
      '一夜暴富',
      '来一场说走就走的旅行',
      '工资翻倍',
      '集满五福',
      '锦鲤上身',
      '吃',
      '喝',
      '玩儿',
      '乐',
      '嗨嗨皮皮',
      '睡到自然醒',
      '四六全过',
      '水逆退散',
      '暴富',
      '脱单',
      '父母健康',
      '考研成功',
      '兜里有糖',
      '2020有你',
      '狂吃不胖',
      '身边小可爱一切都好',
      '身边的小婊砸一切安好',
      '没有加班',
      '逢考必过',
      '无忧无虑',
      '不堵车',
      '遇见最爱的人',
      '抢红包手气最佳',
      '生日收到心仪的礼物',
      '抖音吸粉无数',
      '喝奶茶不长胖',
      '找到对象',
      '交很多朋友',
      '养到心爱的宠物',
      '卡里有钱',
      '运气爆棚',
      '桃花拉满',
      '抖音收获百万赞',
      '收到一打压岁钱',
      '喜得贵子',
      '家和万事兴',
      '两个月年终奖到账',
      '不再失眠',
      '抢到杰伦演唱会的票',
      '顽皮',
      '偶遇爱豆',
      '心想事成',
      '与爱人一起看雪',
      '一家人健健康康',
      '环球旅行',
      '世界和平',
      '周杰伦发新专辑',
      '出门见喜',
      '没有失眠',
      '没有脱发',
      '没有抑郁',
      '没有焦虑',
      '尝到各种美食',
    ];
    let text_list = [];
    for (let i = 0; i < lucks.length; i++) {
      if (text_list.length < 5) {
        text_list = [...new Set(text_list)];
        let string = lucks[Math.round(Math.random() * (lucks.length - 1))];
        text_list = text_list.concat(string);
      }
    }
    data._openid = wxContext.OPENID;
    data.active_name = 'luck2020';
    data.luck_list = text_list;
    data.avatarUrl = user.avatarUrl;
    data.niceName = user.nickName;
    data.create_time = (new Date()).getTime();
    data.change_time = (new Date()).getTime();
    await db.collection('active').add({ data: data });
    let new_active = (await db.collection('active').where({ _openid: wxContext.OPENID, active_name: 'luck2020' }).get()).data[0];
    return new_active;
  }


}