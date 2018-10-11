// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const records = db.collection('deskUsageRecords')


  const beginTs = Date.from(`${event.date} ${event.startTime}`).valueOf()
  const endTs = Date.from(`${event.date} ${event.endTime}`).valueOf()
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

  //同一个用户同个时刻只能占用一个桌子
  var non_cancelled, page = 0
  do {
    non_cancelled = (await cloud.callFunction({
      name: 'query_order_records',
      data: {
        type: 'non-cancelled',
        page
      }
    })).result.data

    if (non_cancelled.filter(x => (x.endTs > beginTs) == (endTs > x.beginTs)).length > 0)
    {
      return {
        errorMsg: "self-conflict"
      }
    }
    page++
  } while (non_cancelled.length > 0)

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
        _openid: event.userInfo.openId,
        beginTs,
        endTs,
        cancelled: false
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

Date.from = function (str, reg = /(\d+)-(\d+)-(\d+)\s(\d+)/) {
  reg.exec(str)
  return new Date(...[RegExp.$1, RegExp.$2 - 1, RegExp.$3, RegExp.$4].map(x => parseInt(x)))
}