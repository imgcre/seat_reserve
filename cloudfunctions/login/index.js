// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const students = db.collection('students')
  var res = await students.where({
    _openid: event.userInfo.openId
  }).get()

  return {
    errorMsg: res.data.length > 0 ? "OK" : "Unregistered"
  }
}