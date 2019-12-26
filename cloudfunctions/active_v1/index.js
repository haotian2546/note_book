// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: process.env.env,
  traceUser: true,
})
const db = cloud.database();
const _ = db.command;
// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.action) {
    case 'active_luck2020': {
      return active_luck2020(event, context)
    }
    case 'active_arrest_add_v1': {
      return active_arrest_add_v1(event, context)
    }
    case 'active_get_the_arrest_v1': {
      return active_get_the_arrest_v1(event, context)
    }
    case 'active_get_arrests_v1': {
      return active_get_arrests_v1(event, context)
    }
    case 'active_up_arrest': {
      return active_up_arrest(event, context)
    }
    default: {
      return
    }
  }
}



//创建一个arrest活动
async function active_arrest_add_v1(event, context) {
  const wxContext = cloud.getWXContext();
  let arrest = event.arrest;
  arrest._openid = wxContext.OPENID;
  let res = await db.collection('arrest').add({ data: arrest });
  return res;
}



//获取一个arrest的数据
async function active_get_the_arrest_v1(event, context) {
  const wxContext = cloud.getWXContext();

  let arrest = (await db.collection('arrest').doc(event.id).get()).data;
  let owner = (await db.collection('user').where({ _openid: arrest._openid }).get()).data[0];
  arrest.owner = owner;
  return arrest;
}


//更新一个arrest||开始

async function active_up_arrest(event, context) {
  const wxContext = cloud.getWXContext();
  let arrest = (await db.collection('arrest').doc(event.id).get()).data;
  let index;
  let index_array;
  if (arrest.number * 1 <= arrest.array.length) {
    return { msg: '以达到限定人数' }
  } else {
    for (let i = 0; i < arrest.array.length; i++) {
      // if (arrest.array[i].user._openid === wxContext.OPENID) {
      //   return { msg: '不能重复抓阄' }
      // }
      index_array.push(arrest.array[i].num)

      // index = Math.round(Math.random() * (arrest.number - 1) + 1);
      // if (arrest.array[i].num * 1 === index * 1) {
      //   index = Math.round(Math.random() * (arrest.number - 1) + 1);
      // }
    };
    if (index_array.indexOf(index) === 0) {
      index = Math.round(Math.random() * (arrest.number - 1) + 1);
    }

    let user = (await db.collection('user').where({ _openid: wxContext.OPENID }).get()).data[0];
    let up = await db.collection('arrest').doc(event.id).update({
      data: {
        array: _.push({ num: index, user })
      },
    })
    return { msg: index };
  }

}



//获取我创建的arrests
async function active_get_arrests_v1(event, context) {
  const wxContext = cloud.getWXContext();
  let arrests = await db.collection('arrest').where({ _openid: wxContext.OPENID }).get();
  return arrests;
}




























async function active_luck2020(event, context) {
  const wxContext = cloud.getWXContext()
  let user = (await db.collection('user').where({ _openid: wxContext.OPENID }).get()).data[0];
  let lucks = [
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
  };
  return { user, text_list }
}