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
      '买到回家的车票',
      '出门就能打上车',
      '冰红茶再来一瓶',
      '集满五福',
      '集齐五福',
      '锦鲤上身',
      '运气爆棚',
      '桃花拉满',
      '千杯不醉',
      '狼人杀活到最后',
      '英雄联盟拿到五杀',
      '把把吃鸡',
      '心想事成',
      '考研成功',
      '逢考必过',
      '顺利毕业',
      '考研成功',
      'offer拿到收手软',
      'ofo退款顺利到账',
      '早上出门就有共享单车',
      '收到一打压岁钱',
      '喜得贵子',
      '家和万事兴',
      '两个月年终奖到账',
      '不再失眠',
      '无忧无虑',
      '落地M4',
      '手机电量100%',
      '手机信号满格',
      '不堵车',
      '遇见最爱的人',
      '抢红包手气最佳',
      '生日收到心仪的礼物',
      '坐地铁有位子',
      '拿到靠窗的机票',
      '抖音收获百万赞',
      '抖音吸粉无数',
      '是一个好人',
      '与爱人一起看雪',
      '一家人健健康康',
      '看视频没有广告',
      '无债一身轻',
      '欠我的钱都还给我',
      '马爸爸帮我还花呗',
      '看到美丽的烟花',
      '不用写作业',
      '环球旅行',
      '有一头乌黑茂密的秀发',
      '看直播不卡顿',
      '周杰伦发新专辑',
      '出门见喜',
      '抢到结论演唱会的票',
      '骗子，别信',
      '偶遇爱豆',
      '世界和平',
      '喝奶茶不长胖',
      '老子编不下去了',
      '真的编不下去了',
      '词穷了',
      '睡到自然醒'
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