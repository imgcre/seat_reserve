// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

tsFromOldVer = function (date, hours) {
  return Date.from(date + " " + hours.toString() + ":00:00").valueOf()
}

// 云函数入口函数
exports.main = async (event, context) => {
  //给所有数据库中的记录添加endTs和beginTs字段

  const db = cloud.database()
  const records = db.collection('deskUsageRecords')

  var res = await records.get()
  var data = res.data

  //_id
  //可以通过update对字段添加字段
  
  
  for(var i in data)
  {
    var crntData = data[i]

    await records.doc(crntData._id).update({
      data: {
        cancelled: false
      }
    })
  }
  
}

Date.from = function (str, reg =/(\d+)-(\d+)-(\d+)\s(\d+):(\d+):(\d+)/) {
  reg.exec(str)
  return new Date(...[RegExp.$1, RegExp.$2 - 1, RegExp.$3, RegExp.$4, RegExp.$5, RegExp.$6].map(x => parseInt(x)))
}
