// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const records = db.collection('deskUsageRecords')

  //先查询一下
  //event.date
  //event.endTime
  //event.startTime

  //event.deskId

  var res = await cloud.callFunction({
    // 要调用的云函数名称
    name: 'desk_query',
    // 传递给云函数的参数
    data: {
      date: event.date,
      endTime: event.endTime,
      startTime: event.startTime
    }
  })

  console.log(res.result.avl)
  if(res.result.avl.find(x => x == event.deskId) != undefined)
  {
    //说明是可用的
    //向服务器插入一条
    await records.add({
      data: {
        date: event.date,
        endTime: event.endTime,
        startTime: event.startTime,
        deskId: event.deskId,
        _openid: event.userInfo.openId
      }
    })
    return {
      errorMsg: "OK"
    }
  }
  else
  {
    //说明是不可用的
    return {
      errorMsg: "Occupied"
    }
  }

}