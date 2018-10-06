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

  if (res.data.length > 0)
  {
    //此微信用户已经注册过, 业务逻辑不应该发生这种情况
    return {
      errorMsg: "WxUserExisted"
    }
  }

  //只要判断学生证号是否相同即可
  res = await students.where({
    stuId: event.stuId
  }).get()

  if(res.data.length > 0)
  {
    return {
      errorMsg: "StuExisted"
    }
  }

  res = await students.add({
    data: {
      stuName: event.stuName,
      stuId: event.stuId,
      _openid: event.userInfo.openId
    }
  })

  return {
    errorMsg: "OK"
  }
}