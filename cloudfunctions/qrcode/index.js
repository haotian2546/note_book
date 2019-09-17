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
  try {
    const result = await cloud.openapi.wxacode.getUnlimited({
      path: event.page,
      scene:event.scene
    })
    console.log(123,result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}