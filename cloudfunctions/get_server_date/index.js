// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

exports.main = async (event, context) => {
  var utc = new Date().getTime()

  return {
    date: utc
  }
}

Date.prototype.format = function (fmt = "yyyy-MM-dd HH:mm:ss") {
  var dic = {
    "y+": this.getFullYear(),
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "H+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
  }

  for (var k in dic)
    if (new RegExp(("(" + k + ")")).test(fmt))
      fmt = fmt.replace(RegExp.$1, RegExp.$1 == 1
        ? dic[k]
        : ("0" + dic[k]).substr(-RegExp.$1.length))

  return fmt;
}