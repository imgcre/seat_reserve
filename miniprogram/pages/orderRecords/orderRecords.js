// miniprogram/pages/orderRecords/orderRecords.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab_sel_state: 0,
    valid_records: {},
    expired_records: {},
    cancelled_records: {}
  },

  onTabTap: function (e) {
    this.setData({
      tab_sel_state: parseInt(e.target.id)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  
  onFABTapped: function(e) {
    wx.navigateTo({
      url: '../main/main',
    })
  },

  onSwiperChange(e) {
    const {detail: {current}} = e;
    this.setData({
      tab_sel_state: current,
    })
  },

  onReady: function () {

  },

  onShow() {
    ['valid', 'expired', 'cancelled'].forEach(async curTpye => {
      const {result: {data}} = await wx.cloud.callFunction({
        name: 'query_order_records',
        data: {
          type: curTpye,
          page: 0,
        },
      });
      this.setData({
        [`${curTpye}_records`]: data.map(({deskId, beginTs, endTs, _id}) => ({
            _id, deskId,
            duration: `${(endTs - beginTs) / 1000 / 60 / 60}小时`,
            ...Object.fromEntries(Object.entries({
              startDate: 'yyyy-MM-dd',
              startTime: 'hh:mm:ss',
            }).map(([key, value]) => [key, new Date(beginTs).format(value)])),
          }),
        ),
      });
    });
  },
})

String.prototype.format = function () {
  var regexp = /\{(\d+)\}/g;
  var args = arguments;
  var result = this.replace(regexp, function (m, i, o, n) {
    return args[i];
  });
  return result;
}

Date.prototype.format = function (fmt) {
  var dic = {
    "y+": this.getFullYear(),
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds()
  }

  for (var k in dic)
    if (new RegExp("({0})".format(k)).test(fmt))
      fmt = fmt.replace(RegExp.$1, RegExp.$1 == 1 ? dic[k] : ("0" + dic[k]).substr(-RegExp.$1.length))

  return fmt;
}