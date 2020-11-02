// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const records = db.collection('deskUsageRecords')
  const $ = db.command
  const beginTs = Date.from(`${event.date} ${event.startTime}`).valueOf() - 8 * 60 * 60 * 1000
  const endTs = Date.from(`${event.date} ${event.endTime}`).valueOf() - 8 * 60 * 60 * 1000

  var valid = (await records.where({
    _openid: event.userInfo.openId,
    cancelled: false,
    endTs: $.gte(new Date().getTime())
  }).get()).data

  if (valid.length >= 5) {
    return {
      errorMsg: "too-frequently"
    }
  } else {
    var res = await cloud.callFunction({
      name: 'desk_query',
      data: {
        date: event.date,
        endTime: event.endTime,
        startTime: event.startTime
      }
    })

    if (valid.filter(x => (x.endTs > beginTs) == (endTs > x.beginTs)).length > 0) {
      return {
        errorMsg: "self-conflict"
      }
    }

    if (res.result.avl.find(x => x == event.deskId) != undefined) {
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
    else {
      return {
        errorMsg: "Occupied"
      }
    }
  }
}

Date.from = function (str, reg = /(\d+)-(\d+)-(\d+)\s(\d+)/) {
  reg.exec(str)
  return new Date(...[RegExp.$1, RegExp.$2 - 1, RegExp.$3, RegExp.$4].map(x => parseInt(x)))
}