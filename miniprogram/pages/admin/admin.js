const app = getApp()
const db = wx.cloud.database()
const _ = db.command

Page({

  data: {
    scrollHeight:427,
    columns: ['全部宿舍', '1栋', '2栋', '3栋', '4栋'],
    applyData:[]
  },

  onLoad: function (options) {
    this.getBuilding()
    this.getApplyData()
    this.getSystem()
  },

  // 获取可使用窗口高度
  getSystem() {
    const res_system = wx.getSystemInfoSync()
    this.setData({
      scrollHeight: res_system.windowHeight - 176
    })
  },

  // 选择宿舍
  onChooseDorm(event) {
    const { value } = event.detail;
    if(value !== '全部宿舍'){
      this.getApplyDataItem(value)
    }else{
      this.getApplyData()
    }
  },

  // 获取宿舍位置
  async getBuilding() {
    await db.collection('building').get().then(res => {
      const location = res.data[0].location
      this.setData({
        columns:location
      })
    }).catch(err => {
      console.log(err)
    })
  },

  // 获取申报数据
  async getApplyData() {
    await db.collection('applyData').get().then(res => {
      this.setData({
        applyData:res.data
      })
    }).catch(err => {
      console.log(err)
    })
  },

  // 获取单独宿舍申报数据
  async getApplyDataItem(value) {
    await db.collection('applyData').where({
      dorm: db.RegExp({
        regexp:value,
        options:'i'
      })
    }).get().then(res => {
      this.setData({
        applyData:res.data
      })
    }).catch(err => {
      console.log(err)
    })
  },

  // 查看申报表
  navDetail(e) {
    const { id, admin } = e.currentTarget.dataset
    wx.navigateTo({
      url: '../detail/detail?id='+id+'&admin='+admin
    })
  },

  // 处理申报数据
  deleteApplyData(e) {
    const { id,dorm,openid } = e.currentTarget.dataset
    this.setData({
      id:id,
      dorm,
      openid
    })
    wx.showModal({
      cancelColor: 'cancelColor',
      title: '温馨提示',
      content: '确认已经维修好该宿舍',
      success:(res) => {
        if(res.confirm){
          this.getApplyDataWhere(id)
        }
      }
    })
  },

  async getApplyDataWhere(id) {
    await db.collection('applyData').where({
      _id:id
    }).get().then(res => {
      this.inCompleteApplyData(res.data)
    }).catch(err => {
      console.log(err)
    })
  },

  // 插入处理数据
  async inCompleteApplyData(finish) {
    await db.collection('completeData').add({
      data:{
        week:app.globalData.week,
        date:app.globalData.obj_date.date,
        month:app.globalData.obj_date.month,
        status:'已处理',
        complete:finish
      }
    }).then(res => {
      this.deleteCallFunction()
    }).catch(err => {
      console.log(err)
    })
  },

  // 云函数删除申报数据
  async deleteCallFunction() {
    await wx.cloud.callFunction({
      name:'db_delete',
      data:{
        id:this.data.id
      }
    }).then(res => {
      wx.showToast({
        title: '处理成功',
        icon:'success',
        duration:500
      })
      wx.navigateTo({
        url: '../success/success?dorm='+this.data.dorm+'&openid='+this.data.openid
      })
    }).catch(err => {
      console.log(err)
    })
  },

  onShow: function () {
    this.getApplyData()
  }
  
})