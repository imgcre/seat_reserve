// miniprogram/pages/checkin/checkin.js

//this是canvasContext
//phase是归一化的
const drawWave = (ctx, rect, amp, periodNum, phase, style) => {
  ctx.beginPath()
  ctx.setFillStyle(style)
  ctx.setLineWidth(0)
  ctx.moveTo(0, rect.height / 2)
  for (var x = 0; x < rect.width + 2; x += 1) {
    //原来是只有三个周期
    var t = (1. * x / rect.width) * periodNum * 2 * Math.PI
    var A = rect.height / 2 * amp
    var y = rect.height / 2 + A * Math.sin(t + phase * 2 * Math.PI)
    ctx.lineTo(x, y)
  }
  ctx.lineTo(rect.width, rect.height)
  ctx.lineTo(0, rect.height)
  ctx.closePath()
  ctx.fill()
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    wave1_file: "",
    wave2_file: "",
    canvas1_hidden: false,
    canvas2_hidden: false
    //canvas绘制一次，之后交给css来播放动画
  },

  onLoad: function(options) {
    const ctx1 = wx.createCanvasContext('canvas_wave1')
    const ctx2 = wx.createCanvasContext('canvas_wave2')
    const query = wx.createSelectorQuery()

    //const wave1 = new WaveObj(ctx, 0.7, 0.006, 0, 'rgba(255,255,255,0.65)')
    //const wave2 = new WaveObj(ctx, 0.5, 0.008, 0.3, 'rgba(255,255,255,0.80)')
    

    query.select('.wave1').boundingClientRect(res => {
      console.log(res)
      drawWave(ctx1, res, 0.12, 7, 0.25, 'rgba(255,255,255,0.98)')
      ctx1.draw()

      drawWave(ctx2, res, 0.15, 5, 0, 'rgba(255,255,255,0.80)')
      ctx2.draw()

      setTimeout(() => {
        wx.canvasToTempFilePath({
          canvasId: 'canvas_wave1',
          width: res.width,
          destWidth: res.width,
          height: res.height,
          destHeight: res.height,
          success: res => {
            this.setData({
              wave1_file: res.tempFilePath,
              canvas1_hidden: true,
            })
          }
        }, this)

        wx.canvasToTempFilePath({
          canvasId: 'canvas_wave2',
          width: res.width,
          destWidth: res.width,
          height: res.height,
          destHeight: res.height,
          success: res => {
            this.setData({
              wave2_file: res.tempFilePath,
              canvas2_hidden: true,
            })
          }
        }, this)
      }, 100)
    }).exec()

  //业务逻辑: 先请求服务器, 求出已被占用的座位
  //用户可在没被占用的作位中选择（一个）座位

    /*
    setInterval(() => query.select('.wave').boundingClientRect(res => {
      wave1.draw(res)
      wave2.draw(res)
      ctx.draw()
    }).exec(), 50)//后面那个10是设置周期用的
    */
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