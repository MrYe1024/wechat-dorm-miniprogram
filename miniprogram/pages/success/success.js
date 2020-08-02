const db = wx.cloud.database()
const _ = db.command

Page({

  data: {

  },

  onLoad: function (options) {
    const {
      dorm,
      submit,
      openid
    } = options
    this.setData({
      dorm
    })
    if (openid) {
      this.setData({
        openid
      })
    }
    if (submit) {
      this.setData({
        submit
      })
    }
    this.getTemplateMessage()
  },

  // 获取模板消息
  async getTemplateMessage() {
    await db.collection('templateMessage').get().then(res => {
      this.setData({
        template1: res.data[0],
        template2: res.data[1]
      })
    }).catch(err => {
      console.log(err)
    })
  },

  // 返回首页
  backHome() {
    wx.showLoading({
      title: '正在返回...'
    })
    wx.requestSubscribeMessage({
      tmplIds: ['xdcaBq1COut3fsO_YvmrvQKYrgDrKmMaR-EwbmvH-VU'],
      success: (res) => {
        wx.cloud.callFunction({
          name: 'templateMessage',
          data: {
            dorm: this.data.dorm,
            name: this.data.template1.name,
            phone: this.data.template1.phone,
            status: this.data.template1.status,
            other: this.data.template1.other
          }
        }).then(res => {
          wx.hideLoading()
          wx.reLaunch({
            url: '../index/index',
          })
        }).catch(err => {
          console.log(err)
        })
      }
    })
  },

  // 发送服务通知
  sendNotice() {
    wx.showLoading({
      title: '正在发送...'
    })
    wx.requestSubscribeMessage({
      tmplIds: ['xdcaBq1COut3fsO_YvmrvQKYrgDrKmMaR-EwbmvH-VU'],
      success: (res) => {
        wx.cloud.callFunction({
          name: 'templateMessage',
          data: {
            dorm: this.data.dorm,
            name: this.data.template2.name,
            phone: this.data.template2.phone,
            status: this.data.template2.status,
            other: this.data.template2.other,
            openid: this.data.openid
          }
        }).then(res => {
          wx.hideLoading()
          wx.reLaunch({
            url: '../admin/admin'
          })
        }).catch(err => {
          console.log(err)
        })
      }
    })
  }

})