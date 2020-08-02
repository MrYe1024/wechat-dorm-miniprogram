const db = wx.cloud.database()

Page({

  data: {

  },

  onLoad: function (options) {
    const { id,admin } = options
    this.getApplyDataItem(id)
    if(admin) {
      this.setData({
        admin
      })
    }
  },

  // 申报表详情
  getApplyDataItem(id) {
    db.collection('applyData').where({
      _id:id
    }).get().then(res => {
      this.setData({
        data:res.data
      })
    }).catch(err => {
      console.log(err)
    })
  }
  
})