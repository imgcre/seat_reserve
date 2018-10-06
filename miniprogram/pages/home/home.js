Page({
  onLoad: function (options) {
    wx.cloud.callFunction({
      name: "login",
      data: {}
    }).then(res => {
      switch (res.result.errorMsg)
      {
        case "OK":
          wx.redirectTo({
            url: "../checkin/checkin"
          })
          break;
        case "Unregistered":
          wx.redirectTo({
            url: "../register/register"
          })
          break;
      }
    })
  },
})