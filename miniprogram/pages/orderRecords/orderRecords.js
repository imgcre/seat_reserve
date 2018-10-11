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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.cloud.callFunction({
      name: 'query_order_records',
      data: {
        type: 'valid',
        page: 0
      }
    }).then(res => {
      //res.result.data 是个数组
      this.setData({
        valid_records: res.result.data.map(x => {
          return {
            deskId: x.deskId,
            startDate: new Date(x.beginTs - 8 * 60 * 60 * 1000).format("yyyy-MM-dd"),
            startTime: new Date(x.beginTs - 8 * 60 * 60 * 1000).format("hh:mm:ss"),
            duration: `${(x.endTs - x.beginTs) / 1000 / 60 / 60}小时`
          }
        })
      })
    })

    wx.cloud.callFunction({
      name: 'query_order_records',
      data: {
        type: 'expired',
        page: 0
      }
    }).then(res => {
      this.setData({
        expired_records: res.result.data.map(x => {
          return {
            deskId: x.deskId,
            startDate: new Date(x.beginTs - 8 * 60 * 60 * 1000).format("yyyy-MM-dd"),
            startTime: new Date(x.beginTs - 8 * 60 * 60 * 1000).format("hh:mm:ss"),
            duration: `${(x.endTs - x.beginTs) / 1000 / 60 / 60}小时`
          }
        })
      })
    })

    wx.cloud.callFunction({
      name: 'query_order_records',
      data: {
        type: 'cancelled',
        page: 0
      }
    }).then(res => {
      this.setData({
        cancelled_records: res.result.data.map(x => {
          return {
            deskId: x.deskId,
            startDate: new Date(x.beginTs - 8 * 60 * 60 * 1000).format("yyyy-MM-dd"),
            startTime: new Date(x.beginTs - 8 * 60 * 60 * 1000).format("hh:mm:ss"),
            duration: `${(x.endTs - x.beginTs) / 1000 / 60 / 60}小时`
          }
        })
      })
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
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