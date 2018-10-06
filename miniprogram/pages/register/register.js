Page({

  onLoad: function(options) {
    console.log(options)
    this.prevPage = options.prevPage
  },

  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    
    console.log(e.detail.value.stuName.length)
    if (e.detail.value.stuName.length == 0)
    {
      wx.vibrateShort()
      wx.showToast({
        title: '学生名称为空',
        icon: 'none'
      })
    } else if (e.detail.value.stuId.length == 0)
    {
      wx.vibrateShort()
      wx.showToast({
        title: '学生证号为空',
        icon: 'none'
      })
    } else {
      wx.showLoading({
        title: '注册中'
      })

      wx.cloud.callFunction({
        name: 'register',
        data: {
          stuId: e.detail.value.stuId,
          stuName: e.detail.value.stuName
        }
      }).then(res => {
        console.log(res)
        wx.hideLoading()
        switch(res.result.errorMsg)
        {
          case 'WxUserExisted':
            wx.showToast({
              title: '发生未知错误',
              icon: 'none'
            })
            break;
          case 'StuExisted':
            wx.showToast({
              title: '该学生已被注册',
              icon: 'none'
            })
            break;
          default:
            if (this.prevPage != undefined)
            {
              wx.redirectTo({
                url: "../" + this.prevPage + "/" + this.prevPage
              })
            }
            break;
        }
      }).catch(err => {
        wx.showToast({
          title: '发生错误',
          icon: 'none'
        })
        wx.hideLoading()
      })
    }
  },
})
