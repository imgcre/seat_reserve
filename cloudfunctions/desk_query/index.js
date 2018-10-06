// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const records = db.collection('deskUsageRecords')
  const $ = db.command
  //deskid: 1~9
  //查询在指定时间区段内被使用的桌子
  //假设桌子的占用是不会越过日期的
  const MAX_LIMIT = 20 //一天一个座位最多的预约数就个可能小时都被占用, 且
  var count = await records.count()
  var skip = 0;
  if (count > MAX_LIMIT)
    skip = count - MAX_LIMIT;

  var res = await records.where({
    date: event.date
  }).skip(skip).get(MAX_LIMIT)
  const fullDeskIds = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  var conflicted = res.data.filter(x => (x.endTime > event.startTime) == (event.endTime > x.startTime)).map(x => x.deskId)
  var available = fullDeskIds.filter(x => !conflicted.includes(x))
  
  return {
    avl: available,
    errorMsg: "OK"
  }

}