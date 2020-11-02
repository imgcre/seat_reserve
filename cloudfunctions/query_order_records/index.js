// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  const db = cloud.database()
  const records = db.collection('deskUsageRecords')
  const $ = db.command

  var order = 'desc'
  var cond = {
    _openid: event.userInfo.openId,
    cancelled: false
  }
  
  switch(event.type) {
    case 'non-cancelled':
      break
    case 'valid':
      cond.endTs = $.gte(new Date().getTime())
      order = 'asc'
      break
    case 'expired':
      cond.endTs = $.lt(new Date().getTime())
      break
    case 'cancelled':
      cond.cancelled = true
      break
    default:
      return {errMsg: 'Unknown type'}
  }

  var docs = await records.where(cond).orderBy('endTs', order).skip(20 * event.page).limit(20).field({
    beginTs: true,
    endTs: true,
    deskId: true,
  }).get()

  return {
    data: docs.data,
    errMsg: 'OK'
  }
}