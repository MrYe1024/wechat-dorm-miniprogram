const app = getApp()
const db = wx.cloud.database()
const _ = db.command
const limit = 20

Page({

  data: {
    scrollHeight: 380,
    columns: ['全部宿舍', '1栋', '2栋', '3栋', '4栋'],
    applyData: [],
    finishData: []
  },

  onLoad: function (options) {
    this.getSystem()
    this.getApplyData()
    this.getBuilding()
    this.getCompleteData()
    this.getOpenid()
    this.onShareMessage()
  },

  // 获取可使用窗口高度
  getSystem() {
    const res_system = wx.getSystemInfoSync()
    this.setData({
      scrollHeight: res_system.windowHeight - 223
    })
  },

  // 跳转申报页
  toPublish() {
    wx.navigateTo({
      url: '../publish/publish'
    })
  },

  // 跳转管理页
  toAdmin() {
    db.collection('verify').where({
      openid: this.data.openid
    }).get().then(res => {
      if (res.data[0] === undefined) {
        wx.showModal({
          cancelColor: 'cancelColor',
          title: '温馨提示',
          content: '你不是管理员!'
        })
      } else {
        wx.navigateTo({
          url: '../admin/admin'
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },

  // 获取用户的openid
  getOpenid() {
    wx.cloud.callFunction({
      name: 'login'
    }).then(res => {
      this.setData({
        openid: res.result.openid
      })
    }).catch(err => {
      console.log(err)
    })
  },

  // 获取本月未处理的申报数据
  async getApplyData() {
    await db.collection('applyData').get().then(res => {
      this.setData({
        applyData: res.data
      })
    }).catch(err => {
      console.log(err)
    })
  },

  // 获取本月已处理的申报数据
  async getCompleteData() {
    await db.collection('completeData').where({
      month: app.globalData.obj_date.month
    }).get().then(res => {
      this.setData({
        finishData: res.data
      })
    }).catch(err => {
      console.log(err)
    })
  },

  // 宿舍选择函数
  onChooseDorm(event) {
    const {
      value
    } = event.detail
    if (value !== '全部宿舍') {
      this.getApplyDataItem(value)
    } else {
      this.getApplyData()
      this.getCompleteData()
    }
  },

  // 获取单独宿舍申报数据
  async getApplyDataItem(value) {
    await db.collection('applyData').where({
      dorm: db.RegExp({
        regexp: value,
        options: 'i'
      })
    }).get().then(res => {
      this.setData({
        applyData: res.data
      })
    }).catch(err => {
      console.log(err)
    })

    await db.collection('completeData').where({
      'complete.0.dorm': db.RegExp({
        regexp: value,
        options: 'i'
      })
    }).get().then(res => {
      this.setData({
        finishData: res.data
      })
    }).catch(err => {
      console.log(err)
    })

  },

  // 查看申报表
  navDetail(e) {
    const {
      id
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: '../detail/detail?id=' + id
    })
  },

  // 设置宿舍栋数
  async getBuilding() {
    await db.collection('building').get().then(res => {
      const location = res.data[0].location
      this.setData({
        columns: location
      })
    }).catch(err => {
      console.log(err)
    })
  },

  // 获取分享数据
  async onShareMessage() {
    await db.collection('share').get().then(res => {
      this.setData({
        shareData: res.data[0]
      })
    })
  },

  // 当前未处理触底事件
  async toLowerGetApplyData() {
    let res = await db.collection('applyData').skip(this.data.applyData.length).get()
    this.setData({
      applyData: [...this.data.applyData, ...res.data], //合并数据
      isEndOfList: res.data.length < limit ? true : false //判断是否数据结束
    })
  },

  // 本月已处理触底事件
  async toLowerGetCompleteData() {
    let res = await db.collection('completeData').where({
      month: app.globalData.obj_date.month
    }).skip(this.data.finishData.length).get()
    this.setData({
      finishData: [...this.data.finishData, ...res.data],
      isCompleteData: res.data.length < limit ? true : false
    })
  },

  // 调用scroll触底事件
  toLower() {
    !this.data.isEndOfList && this.toLowerGetApplyData()
  },
  toLowerComplete () {
    !this.data.isCompleteData && this.toLowerGetCompleteData()
  },

  // 监听页面显示
  onShow: function () {
    this.getApplyData()
    this.getCompleteData()
  },

  // 监听用户点击分享
  onShareAppMessage: function () {
    return {
      title: this.data.shareData.title,
      path: this.data.shareData.path,
      imageUrl: this.data.shareData.imageUrl,
      success: res => {
        console.log(res)
      },
      fail: err => {
        console.log(err)
      }
    }
  }

})