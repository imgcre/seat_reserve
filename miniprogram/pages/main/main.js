Page({
  data: {
    btn_select_disable: true,
    btn_loading: false,
    desk_idx: 0,
    desk_selector_disabled: true,
    show_result: false,
    stu_name: "ERR"
  },

  onLoad: function (options) {
    //请假设下面的数组是无序的
    this.raw_starttime = [7, 8, 10, 13, 14, 16, 18, 19, 20, 21]
    this.time_section = [12, 17, 23] //占用时段不能跨过时间节点
    this.durations = [1, 2, 3, 4]
    this.updateDate()

    //TODO: TODO TODO TODO TODO TODO 支持下拉刷新
    //如果该用户没有注册, 则先跳转到注册页面
    wx.cloud.callFunction({
      name: 'login',
      data: { }
    }).then(res => {
      console.log(res)
      switch (res.result.errorMsg)
      {
        case "Unregistered":
          //跳转到注册页面
          //当页面栈返回的时候, 刷新用户信息
          wx.redirectTo({
            url: "../register/register?prevPage=main"
          })
          break;
        case "OK":
          this.setData({
            stu_name: res.result.stuName
          })
          break;
      }
    })
  },

  //用来修改起始日期和结束日期的
  updateDate: function() {
    //如果今天现在时间超过最晚的起始时间，那么从明天开始预约
    var date = new Date()
    if (date.getHours() >= Math.max(...this.raw_starttime))
      date.setDate(date.getDate() + 1)
    var first_valid_day = date.format("YYYY-MM-DD")
    date.setDate(date.getDate() + 3)
    var endday = date.format("YYYY-MM-DD")
    this.crnt_date = first_valid_day
    this.setData({
      date_start: first_valid_day,
      date: first_valid_day,
      date_end: endday,
    })
    this.updateStartTime(first_valid_day)
  },

  updateStartTime: function(selected_date) {
    //如果日期是今天，那么起始时间只能选择当前时间之后的时间
    var date = new Date()
    var today = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    var raw_starttime = this.raw_starttime.concat()
    if (today.getTime() == new Date(selected_date.replace(/-/g, "/")).getTime())
      raw_starttime = raw_starttime.filter(x => x > date.getHours())
    this.crnt_raw_starttimes = raw_starttime
    this.crnt_starttime = raw_starttime[0]
    this.setData({
        starttime: raw_starttime.map(x => "{0}:00".format(x)),
      starttime_idx: 0
    })
    this.updateDuration(raw_starttime[0])
  },

  updateDuration: function(selected_starttime) {
    //取比大于以选择时间的最小时间节点
    var min_section = Math.min(...this.time_section.filter(x => x > selected_starttime))
    //取所有加上不会超过时间节点的占用时间
    this.crnt_durations = this.durations.filter(x => selected_starttime + x <= min_section)
    this.crnt_duration = this.crnt_durations[0]
    this.setData({
      duration: this.crnt_durations.map(x => x + "小时"),
      duration_idx: 0
    })
    this.updateDesks()
  },

  updateDesks: function() {
    this.setData({
      btn_loading: true,
      btn_select_disable: true,
      desk_selector_disabled: true
    })


    wx.cloud.callFunction({
        name: 'desk_query',
        data: {
          date: this.crnt_date,
          startTime: this.crnt_starttime,
          endTime: this.crnt_starttime + this.crnt_duration
        }
      }).then(res => {
        //res.result
        //查询的时候, 座位是不可选的, 并且按钮是被禁用的
        this.avl_desks = res.result.avl
        this.crnt_desk = this.avl_desks.length > 0 ? this.avl_desks[0] : null
        this.setData({
          desk_avl: this.avl_desks.map(x => "座位" + x),
          desk_idx: 0
        })

        if (this.avl_desks.length > 0)
        {
          this.setData({
            btn_select_disable: false,
            desk_selector_disabled: false
          })
        }

        this.setData({
          btn_loading: false
        })
      }).catch(err => {
        this.setData({
          btn_loading: false
        })
      })
  },

  //日期被改变
  onDateChanged: function(e) {
    this.crnt_date = e.detail.value
    this.updateStartTime(e.detail.value)
    //更新页面
    this.setData({
      date: e.detail.value
    })
  },

  //起始时间被改变
  onStarttimeChanged: function(e) {
    this.crnt_starttime = this.crnt_raw_starttimes[e.detail.value]
    this.updateDuration(this.crnt_raw_starttimes[e.detail.value])
    //更新页面
    this.setData({
      starttime_idx: e.detail.value
    })
  },

  //占用时长被改变
  onDurationChanged: function(e) {
    //更新页面
    this.crnt_duration = this.crnt_durations[e.detail.value]
    this.updateDesks()
    this.setData({
      duration_idx: e.detail.value
    })
  },

  onDeskChanged: function(e) {
    this.crnt_desk = this.avl_desks[e.detail.value]
    this.setData({
      desk_idx: e.detail.value
    })
  },

  onBtnClick: function(e) {
    //调用云函数, 此时用模态loading

    wx.showLoading({
      title: '预约中'
    })
    wx.cloud.callFunction({
      name: 'desk_order',
      data: {
        date: this.crnt_date,
        startTime: this.crnt_starttime,
        endTime: this.crnt_starttime + this.crnt_duration,
        deskId: this.crnt_desk
      }
    }).then(res => {
      wx.hideLoading()
      switch (res.result.errorMsg)
      {
        case "OK":
          this.setData({
            show_result: true
          })
          break;
        default:
          wx.showToast({
            title: '预约失败',
            icon: 'none'
          })
          break;
      }
      this.updateDesks()
    }).catch(err => {
      wx.hideLoading()
    })
  },

  onMaskTap: function(e) {
    
    if(e.target.id == "mask")
    {
      this.setData({
        show_result: false
      })
    }
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
    "Y+": this.getFullYear(),
    "M+": this.getMonth() + 1,
    "D+": this.getDate()
  }

  for (var k in dic)
    if (new RegExp("({0})".format(k)).test(fmt))
      fmt = fmt.replace(RegExp.$1, RegExp.$1 == 1 ? dic[k] : ("0" + dic[k]).substr(-RegExp.$1.length))

  return fmt;
}